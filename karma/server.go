package main

import (
	"encoding/json"
	"net/http"

	"github.com/go-martini/martini"
	"github.com/martini-contrib/cors"
	"gopkg.in/redis.v2"
)

func main() {
	m := martini.Classic()
	m.Map(SetRedis())
	//m.Map(render.Renderer())

	// CORS
	m.Use(cors.Allow(&cors.Options{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"PUT", "GET", "POST", "DELETE"},
		AllowHeaders:     []string{"Origin"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	m.Get("/posts/:id/karma", Karma)
	m.Put("/posts/:id/up", Authenticate, KarmaUp)
	m.Put("/posts/:id/down", Authenticate, KarmaDown)

	m.RunOnAddr(":3006")
}

func SetRedis() *redis.Client {
	cli := redis.NewTCPClient(&redis.Options{
		Addr: ":6379",
	})
	return cli
}

func Authenticate(rw http.ResponseWriter, req *http.Request, credis *redis.Client, c martini.Context) {
	cookie, err := req.Cookie("_shared_session")
	if err != nil {
		rw.WriteHeader(http.StatusUnauthorized)
		rw.Write([]byte("unautorized"))
		return
	}
	session := credis.HGet("sessionStore", cookie.Value).Val()
	if session == "" {
		rw.WriteHeader(http.StatusUnauthorized)
		rw.Write([]byte("unautorized"))
		return
	}

	var dat map[string]interface{}
	byt := []byte(session)
	user := json.Unmarshal(byt, &dat)
	c.Map(user)
}

func Karma(rw http.ResponseWriter, req *http.Request, credis *redis.Client, params martini.Params) {
	score := credis.Get("post:" + params["id"] + "score").Val()
	json.NewEncoder(rw).Encode(map[string]interface{}{"karma": score})
}

func KarmaUp(rw http.ResponseWriter, req *http.Request, credis *redis.Client, params martini.Params) {
	score := credis.Incr("post:" + params["id"] + "score").Val()
	json.NewEncoder(rw).Encode(map[string]interface{}{"karma": score})
}

func KarmaDown(rw http.ResponseWriter, req *http.Request, credis *redis.Client, params martini.Params) {
	score := credis.IncrBy("post:"+params["id"]+"score", -1).Val()
	json.NewEncoder(rw).Encode(map[string]interface{}{"karma": score})
}

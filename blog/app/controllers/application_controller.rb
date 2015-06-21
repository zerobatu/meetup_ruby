class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def after_sign_in_path_for(resource)
    cookies['_shared_session'] = {
      value: Digest::MD5.hexdigest(
        "#{session[:session_id]}:#{current_user.id}"
      ),
      domain: :all
    }

    meta_data = JSON.generate({ id: current_user.id, email: current_user.email })
    $redis.hset('sessionStore', cookies['_shared_session'], meta_data)

    super
  end

  def after_sign_out_path_for(resource_or_scope)
    if cookies['_shared_session'].present?
      $redis.hdel('sessionStore', cookies['_shared_session'])
    end

    super
  end

end

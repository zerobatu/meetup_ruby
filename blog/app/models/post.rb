class Post < ActiveRecord::Base
  belongs_to :user

  include Bootsy::Container
end

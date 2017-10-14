class User < ActiveRecord::Base
  has_secure_password
  validates :email, uniqueness: true, presence: true, email: true
end

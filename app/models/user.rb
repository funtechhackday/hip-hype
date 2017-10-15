class User < ActiveRecord::Base
  has_secure_password

  attachment :avatar

  has_many :authorizations, dependent: :destroy

  validates :email, uniqueness: true, presence: true, email: true

  def guest?
    false
  end

end

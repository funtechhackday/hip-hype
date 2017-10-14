class UserRegistrationType < User
  include ApplicationType

  validates :password, presence: true

  permit :email, :password, :first_name, :last_name

  def email=(email)
    write_attribute(:email, email.mb_chars.downcase)
  end
end

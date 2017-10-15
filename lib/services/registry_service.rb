module Services
  class RegistryService
    attr_reader :provider, :method, :hash

    def initialize(oauth_hash)
      @provider = oauth_hash.provider
      @hash = oauth_hash
      @info = oauth_hash.info
    end

    def process(_params = {})
      auth = User::Authorization.find_by(provider: @hash.provider, uid: @hash.uid)
      return auth.user if auth

      user = User.find_by(email: @info.email)
      user = create_user_with_temp_password unless user
      user.confirm unless user.active?

      user.authorizations.create(provider: @hash.provider, uid: @hash.uid)

      fetch_avatar(user)
      user
    end

    private

    def create_user_with_temp_password
      pass = SecureHelper.generate_token
      first_name, last_name, middle_name = *@info.name.split(' ', 3)
      User.create(email: @info.email, password: pass, password_digest: pass,
                  first_name: first_name, last_name: last_name, middle_name: middle_name)
    end

    def fetch_avatar(user)
      if !user.avatar && @info.image.present?
        user.remote_avatar_url = @info.image.split('?').first
        user.save
      end
    end
  end
end

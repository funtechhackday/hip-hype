Rails.application.config.middleware.use OmniAuth::Builder do
  provider :developer, fields: [:first_name, :last_name], uid_field: :last_name if Rails.env.development?
  provider :vkontakte, configus.socials.vk.api_key, configus.socials.vk.api_secret, scope: 'email', image_size: 'original', redirect_url: 'http://localhost:3000/auth/vkontakte/callback'
  provider :facebook, configus.socials.facebook.app_id, configus.socials.facebook.app_secret, scope: 'public_profile,email', info_fields: 'email,name'
end

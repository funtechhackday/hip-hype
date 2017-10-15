class ApplicationController < ActionController::Base
  include Concerns::AuthService
  include Concerns::FlashService

  protect_from_forgery with: :exception

  helper_method :signed_in?, :current_user
end

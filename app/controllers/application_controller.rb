class ApplicationController < ActionController::Base
  include Concerns::FlashService

  protect_from_forgery with: :exception
end

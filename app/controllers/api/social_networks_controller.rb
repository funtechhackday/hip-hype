class Api::SocialNetworksController < Api::ApplicationController
  def auth_callback
    response = request.env['omniauth.auth']
    if response
      registry_service = Services::RegistryService.new(response)
      user = registry_service.process
      sign_in user
      redirect_to account_path
    else
      render json: :oauth_error
    end
  end
end

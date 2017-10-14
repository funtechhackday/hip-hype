class Web::WelcomeController < Web::ApplicationController

  def index
    @users = User.all
  end

end

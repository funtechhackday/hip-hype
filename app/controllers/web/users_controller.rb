class Web::UsersController < Web::ApplicationController

  def new
    @user = UserRegistrationType.new
  end

  def create
    @user = UserRegistrationType.new(params[:user])
    if @user.save
      f(:success)
      redirect_to root_path
    else
      f(:error)
      render :new
    end
  end

end

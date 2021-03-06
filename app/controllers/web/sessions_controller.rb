class Web::SessionsController < Web::ApplicationController

  def new
    @user_type = UserSignInType.new
  end

  def create
    @user_type = UserSignInType.new(params[:user_sign_in_type].permit!)

    if @user_type.valid?
      user = @user_type.user
      f(:success)
      sign_in(user)
      redirect_to root_path
    else
      render :new
    end
  end

  def destroy
    sign_out
    f(:success)
    redirect_to root_path
  end

end

class Web::AccountsController < Web::ApplicationController
  before_action :authenticate_user!

  def show
    @user = current_user
  end

  def edit
    @user = current_user
  end

  def update
    @user = current_user

    if @user.update user_params
      f(:success)
      redirect_to account_path
    else
      render :edit
    end
  end

  def user_params
    params.require(:user).permit(:first_name, :last_name)
  end
end

class Admin::UsersController < Admin::ApplicationController

  def index
    @users = User.all.order(:id)
  end

  def edit
    @user = User.find(params[:id])
  end

  def update
    @user = User.find(params[:id])

    if @user.update user_params
      f(:success)
      redirect_to admin_users_path
    else
      f(:error)
      render :edit
    end
  end

  def user_params
    params.require(:user).permit(:first_name, :last_name, :avatar)
  end
end

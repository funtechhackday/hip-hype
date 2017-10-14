Rails.application.routes.draw do
  namespace :admin do
    root to: 'users#index'
    resources :users, only: [:index, :edit, :update]
  end
end

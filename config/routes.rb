Rails.application.routes.draw do

  scope module: :web do
    root to: 'welcome#index'
    resource :session, only: [:new, :create, :destroy]
    resource :account, only: [:show, :edit, :update]
    resources :users, only: [:new, :create]
  end

  namespace :admin do
    root to: 'users#index'
    resources :users, only: [:index, :edit, :update]
  end
  match '/auth/:provider/callback' => 'api/social_networks#auth_callback', via: [:get, :post]
end

Rails.application.routes.draw do

  get 'hello_world', to: 'hello_world#index'
  scope module: :web do
    root to: 'welcome#index'
    resource :session, only: [:new, :create, :destroy]
    resource :account, only: [:show, :edit, :update]
    resources :users, only: [:new, :create]
    resources :hype_tracks, only: [:index, :show]
  end

  namespace :admin do
    root to: 'users#index'
    resources :users, only: [:index, :edit, :update]
    resources :hype_tracks
  end
  match '/auth/:provider/callback' => 'api/social_networks#auth_callback', via: [:get, :post]
end

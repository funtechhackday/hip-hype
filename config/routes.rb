Rails.application.routes.draw do

  scope module: :web do
    root to: 'welcome#index'
  end

  namespace :admin do
    root to: 'users#index'
    resources :users, only: [:index, :edit, :update]
  end
  
end

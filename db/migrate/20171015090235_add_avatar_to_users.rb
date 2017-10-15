class AddAvatarToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :avatar_id, :string
    add_column :users, :avatar_filename, :string
    add_column :users, :avatar_content_type, :string
    add_column :users, :avatar_size, :integer
  end
end

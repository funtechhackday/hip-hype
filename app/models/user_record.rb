class UserRecord < ApplicationRecord
  belongs_to :record
  belongs_to :hype_track
  belongs_to :user
end

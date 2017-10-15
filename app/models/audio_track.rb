class AudioTrack < ApplicationRecord
  attachment :audio_file

  has_many :hype_tracks

end

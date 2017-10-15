class Admin::AudioTracksController < Admin::ApplicationController

  def index
    @audio_tracks = AudioTrack.all
  end

  def show
  end

  def new
    @audio_track = AudioTrack.new
  end

  def edit
    @audio_track = AudioTrack.find(params[:id])
  end

  def create
    @audio_track = AudioTrack.new(audio_track_params)
    if @audio_track.save
      f(:success)
      redirect_to admin_audio_tracks_path
    else
      f(:error)
      render :new
    end
  end

  def update
    @audio_track = AudioTrack.find(params[:id])

    if @audio_track.update audio_track_params
      f(:success)
      redirect_to admin_audio_tracks_path
    else
      f(:error)
      render :edit
    end
  end

  def destroy
    @audio_track = AudioTrack.find(params[:id])
    @audio_track.destroy
    f(:success)
    redirect_to admin_audio_tracks_path
  end

  private

    def audio_track_params
      params.require(:audio_track).permit(:audio_file, :delay)
    end
end

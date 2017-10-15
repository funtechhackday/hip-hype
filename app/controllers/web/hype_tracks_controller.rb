class Web::HypeTracksController <  Web::ApplicationController
  def index
    @tracks = HypeTrack.all
  end

  def show
    @track = HypeTrack.find(params[:id])
  end

  def add_record
    # byebug
    @user = current_user
    @track = HypeTrack.find(params[:hype_track_id])

    @user_record = @track.user_records.create(
      user: @user,
      track_string: params[:string],
      record: Record.create(file: params[:record]),
    )

    if @track.user_records > 8 && !@track.mixed do
      @track.mix_track
    end

  end

  def listen
    @track = HypeTrack.find(1)
    @user = User.find(6)
    @user2 = User.find(7)
  end
end

class Web::HypeTracksController <  Web::ApplicationController
  def index
    @tracks = HypeTrack.all
  end

  def show
    @track = HypeTrack.find(params[:id])
  end

  def listen
    @track = HypeTrack.last
    @user = User.find(6)
    @user2 = User.find(7)
  end
end

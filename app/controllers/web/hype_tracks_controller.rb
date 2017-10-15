class Web::HypeTracksController <  Web::ApplicationController
  def index
    @tracks = HypeTrack.all
  end

  def show
    @track = HypeTrack.find(params[:id])
  end
end

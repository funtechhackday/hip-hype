class Admin::HypeTracksController < Admin::ApplicationController
  before_action :set_admin_hype_track, only: [:show, :edit, :update, :destroy]

  # GET /admin/hype_tracks
  # GET /admin/hype_tracks.json
  def index
    @admin_hype_tracks = HypeTrack.all
  end

  # GET /admin/hype_tracks/1
  # GET /admin/hype_tracks/1.json
  def show
  end

  # GET /admin/hype_tracks/new
  def new
    @admin_hype_track = HypeTrack.new
  end

  # GET /admin/hype_tracks/1/edit
  def edit
  end

  # POST /admin/hype_tracks
  # POST /admin/hype_tracks.json
  def create
    @admin_hype_track = HypeTrack.new(admin_hype_track_params)
    if @admin_hype_track.save
      f(:success)
      redirect_to [:admin, @admin_hype_track]
    else
      f(:success)
      render :new
    end
  end

  # PATCH/PUT /admin/hype_tracks/1
  # PATCH/PUT /admin/hype_tracks/1.json
  def update
    if @admin_hype_track.update(admin_hype_track_params)
      f(:success)
      redirect_to [:admin,@admin_hype_track]
    else
      f(:success)
      render :edit
    end
  end

  # DELETE /admin/hype_tracks/1
  # DELETE /admin/hype_tracks/1.json
  def destroy
    @admin_hype_track.destroy
    f(:success)
    redirect_to [:admin, admin_hype_tracks_url]
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_admin_hype_track
      @admin_hype_track = HypeTrack.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def admin_hype_track_params
      params.require(:hype_track).permit(:name, :theme)
    end
end

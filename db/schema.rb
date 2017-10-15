# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20171015113741) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "audio_tracks", force: :cascade do |t|
    t.string "audio_file_id", null: false
    t.string "audio_file_filename", null: false
    t.string "audio_file_size", null: false
    t.string "audio_file_content_type", null: false
    t.integer "delay"
  end

  create_table "hype_tracks", force: :cascade do |t|
    t.string "name"
    t.text "theme"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "records", force: :cascade do |t|
    t.string "file_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "user_authorizations", force: :cascade do |t|
    t.string "uid"
    t.bigint "user_id"
    t.string "provider"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_user_authorizations_on_user_id"
  end

  create_table "user_records", force: :cascade do |t|
    t.bigint "record_id"
    t.bigint "hype_track_id"
    t.string "track_string"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["hype_track_id"], name: "index_user_records_on_hype_track_id"
    t.index ["record_id"], name: "index_user_records_on_record_id"
    t.index ["user_id"], name: "index_user_records_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.string "email"
    t.string "password_digest"
    t.string "avatar_id"
    t.string "avatar_filename"
    t.string "avatar_content_type"
    t.integer "avatar_size"
  end

  add_foreign_key "user_authorizations", "users"
  add_foreign_key "user_records", "hype_tracks"
  add_foreign_key "user_records", "records"
  add_foreign_key "user_records", "users"
end

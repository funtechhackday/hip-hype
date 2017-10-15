class HypeTrack < ApplicationRecord
  has_many :user_records
  # has_many :users, throught: :user_records
  belongs_to :record, optional: true
  belongs_to :audio_track

  def mix_track
    require 'open3'
    timestamp = Time.now.to_i
    path_records = '/public/uploads/store/'
    records_list_file = "/tmp/files#{timestamp}.txt"
    speech_file = "/tmp/speech#{timestamp}.wav"
    speech_file_conv = "/tmp/speech#{timestamp}.mp3"
    output_file = "/tmp/output#{timestamp}.mp3"
    final_file  = "/tmp/final#{timestamp}.mp3"
    # final_file  = "/tmp/final#{Time.now.to_i}.mp3"
    # beat_file   = "beat2.mp3"
    beat_file   = "#{Rails.root.to_s}#{path_records}#{audio_track.audio_file.id}"
    delay = audio_track.delay

    puts records_list_file
    File.open(records_list_file, 'a') do |file|
      user_records.each do |user_record|
        # 'ffmpeg -i son_origine.wav -vn -ar 44100 -ac 2 -ab 192 -f mp3 son_final.mp3'
        file.puts "file '#{Rails.root.to_s}#{path_records}#{user_record.record.file.id}'"
      end
    end

    # FILES_ROOT = '~/Projects/try-ffmpeg/tracks'
    # FILES_ROOT = '/home/andrey/Projects/try-ffmpeg/tracks'


    # speech_file = "/tmp/speech#{Time.now.to_i}.mp3"
    # output_file = "/tmp/output#{Time.now.to_i}.mp3"
    # final_file  = "/tmp/final2.mp3"
    # final_file  = "/tmp/final#{Time.now.to_i}.mp3"
    cmd1 = "yes | ffmpeg -f concat -safe 0  -i #{records_list_file} -c copy #{speech_file}"
    cmd2 = "yes | ffmpeg -i #{speech_file} -vn -ar 44100 -ac 2 -ab 192k -f mp3 #{speech_file_conv}"
    cmd3 = "yes | ffmpeg -i #{speech_file_conv} -filter_complex 'volume=26dB,atempo=1.3,bass,adelay=#{delay}|#{delay}' #{output_file}"
    cmd4 = "yes | ffmpeg -i #{output_file} -i #{beat_file} -filter_complex 'amix=inputs=2:duration=first:dropout_transition=3,bass' #{final_file}"



    # sample.transcode("output.mp3", {} , { input:  'part%03d.mp3'  })
    # sample.transcode("output.mp3", {} , { })
    # sample.transcode("output.mp3", %w(-filter_complex amerge -ac 2 -c:a libmp3lame -q:a 4) , { input: 'text.mp3' })
    # puts text.inspect
    # puts beat.methods
    # puts beat.path
    # puts beat.audio_streams.inspect
    # puts `ls`

    output = ""

    Open3.popen3(cmd1) do |stdin, stdout, stderr, wait_thr|
      puts "stdout is:" + stdout.read
      puts "stderr is:" + stderr.read
    end

    Open3.popen3(cmd2) do |stdin, stdout, stderr, wait_thr|
      puts "stdout is:" + stdout.read
      puts "stderr is:" + stderr.read
    end

    Open3.popen3(cmd3) do |stdin, stdout, stderr, wait_thr|
      puts "stdout is:" + stdout.read
      puts "stderr is:" + stderr.read
    end

    Open3.popen3(cmd4) do |stdin, stdout, stderr, wait_thr|
      puts "stdout is:" + stdout.read
      puts "stderr is:" + stderr.read
    end

    res_file = File.open(final_file, 'r')
    self.record = Record.create(file: res_file)
    self.mixed = true
    save

  end
end

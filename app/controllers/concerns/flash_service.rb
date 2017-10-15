module Concerns
  module FlashService
    def f(key, options = {})
      scope = [:flash]
      scope << params[:controller].split("/")
      scope << params[:action]

      if options.present?
        options.merge!({scope: scope}) unless options[:scope]
        msg = t(key, options)
      else
        msg = t(key, scope: scope)
      end

      Rails.logger.debug("flash: #{msg}".colorize(:green))

      if options[:now]
        flash.now[key] = msg
      else
        flash[key] = msg
      end
    end
  end
end

module BootstrapHelper

  def bootstrap_flash_messages
    messages = ""
    if (msg = flash[:notice] || flash[:success])
      messages = render "bootstrap/notice", message: msg
    end
    messages += render "bootstrap/alert", message: flash[:alert] if flash[:alert]
    messages += render "bootstrap/error", message: flash[:error] if flash[:error]
    messages.html_safe
  end
  
end

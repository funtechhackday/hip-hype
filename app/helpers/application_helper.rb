module ApplicationHelper

  def nav_link(link_text, link_path, link_class, li_class)
    if request.fullpath == link_path
      class_name = "#{li_class} active";
    elsif link_path != '/' && request.fullpath.start_with?(link_path)
      class_name = "#{li_class} active";
    else
      class_name = li_class;
    end

    content_tag(:li, :class => class_name) do
      link_to link_text, link_path, :class => link_class
    end
  end

end

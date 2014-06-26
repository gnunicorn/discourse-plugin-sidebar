class SidebarBox
  attr_accessor :plugins_sidebar
  def initialize(controller_name, action_name)
    @plugins_sidebar = []
    SiteSetting.sidebar_widgets.split("|").each do |element|
      begin
        @plugins_sidebar << "::Sidebar::#{element.camelcase}".constantize.new(controller_name, action_name)
      rescue NameError => e
      end
  	end
	end

	def to_partial_path
		"sidebar/sidebar"
  end

end
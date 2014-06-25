class SidebarBox
	def initialize
    pp "::::::::::::::::::::::::::::::::::::::::::::::::::::::::::"
		@plugins_sidebar = []
    SiteSetting.sidebar_widgets.split("|").each do |element|
    	pp "---------------> #{element}"
      begin
        #@plugins_sidebar << "::Sidebar::#{element.camelcase}".constantize.new
      rescue NameError => e
        pp element
      end
  	end
	end

	def to_partial_path
		"sidebar/show"
	end
end
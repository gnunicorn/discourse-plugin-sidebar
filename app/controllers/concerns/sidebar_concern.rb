module SidebarConcern
	extend ActiveSupport::Concern

  included do |base|
    before_filter :sidebar
  end

	def sidebar
    @sidebar = SidebarBox.new
	end
end
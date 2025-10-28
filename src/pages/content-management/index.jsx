import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/ui/AdminSidebar';
import AdminBreadcrumb from '../../components/ui/AdminBreadcrumb';
import ContentHeader from './components/ContentHeader';
import ContentFilters from './components/ContentFilters';
import ContentTable from './components/ContentTable';
import BulkActionsBar from './components/BulkActionsBar';
import ContentEditor from './components/ContentEditor';
import ContentPreview from './components/ContentPreview';

const ContentManagement = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filters, setFilters] = useState({
    contentType: 'all',
    status: 'all',
    author: 'all',
    dateFrom: '',
    search: ''
  });
  const [editorOpen, setEditorOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState(null);

  // Mock content data
  const [contentData, setContentData] = useState([
    {
      id: 1,
      title: "Santorini Island Paradise",
      description: "Experience the breathtaking beauty of Santorini with its iconic blue-domed churches, stunning sunsets, and crystal-clear waters.",
      type: "destination",
      status: "published",
      author: "Admin User",
      lastModified: "2025-01-10T14:30:00Z",
      thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      content: `Santorini, officially known as Thira, is one of the most spectacular islands in the Greek Cyclades. This volcanic island offers visitors an unforgettable experience with its dramatic cliffs, pristine beaches, and world-renowned sunsets.\n\nKey Attractions:\n• Oia Village - Famous for its sunset views\n• Red Beach - Unique volcanic sand\n• Ancient Akrotiri - Archaeological site\n• Fira Town - Capital with stunning views\n• Wine Tasting - Local volcanic wines\n\nBest Time to Visit: April to October for warm weather and clear skies.`,
      tags: ["greece", "islands", "sunset", "romance", "mediterranean"],
      seoTitle: "Santorini Greece Travel Guide - Best Things to Do",
      seoDescription: "Discover Santorini's best attractions, beaches, and experiences. Complete travel guide with tips for visiting this Greek island paradise.",
      featured: true
    },
    {
      id: 2,
      title: "7-Day Mediterranean Cruise Package",
      description: "Luxury cruise package visiting multiple Mediterranean destinations including Rome, Barcelona, and French Riviera.",
      type: "package",
      status: "published",
      author: "Content Manager",
      lastModified: "2025-01-08T09:15:00Z",
      thumbnail: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
      content: `Embark on an unforgettable 7-day Mediterranean cruise adventure. This luxury package includes visits to some of Europe's most beautiful coastal cities.\n\nItinerary Highlights:\nDay 1: Rome (Civitavecchia), Italy\nDay 2: Florence/Pisa (Livorno), Italy\nDay 3: French Riviera (Cannes), France\nDay 4: Barcelona, Spain\nDay 5: Palma, Mallorca\nDay 6: Sea Day - Relax onboard\nDay 7: Return to Rome\n\nPackage Includes:\n• All meals and beverages\n• Shore excursions\n• Entertainment and activities\n• Luxury cabin accommodation`,
      tags: ["cruise", "mediterranean", "luxury", "package", "europe"],
      seoTitle: "7-Day Mediterranean Cruise - Luxury Travel Package",
      seoDescription: "Book your Mediterranean cruise package. 7 days visiting Rome, Barcelona, French Riviera with all-inclusive luxury amenities.",
      featured: false
    },
    {
      id: 3,
      title: "Grand Hotel Palazzo - Rome",
      description: "Luxury 5-star hotel in the heart of Rome, steps away from the Colosseum and Roman Forum.",
      type: "hotel",
      status: "draft",
      author: "Editor",
      lastModified: "2025-01-12T16:45:00Z",
      thumbnail: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop",
      content: `Experience the epitome of luxury at Grand Hotel Palazzo, Rome's premier 5-star accommodation. Located in the historic center, our hotel offers unparalleled access to the city's most iconic landmarks.\n\nHotel Features:\n• 150 elegantly appointed rooms and suites\n• Rooftop restaurant with panoramic city views\n• Full-service spa and wellness center\n• 24-hour concierge service\n• Business center and meeting facilities\n• Valet parking available\n\nNearby Attractions:\n• Colosseum (5-minute walk)\n• Roman Forum (3-minute walk)\n• Palatine Hill (7-minute walk)\n• Capitoline Museums (10-minute walk)`,
      tags: ["rome", "luxury", "hotel", "historic", "colosseum"],
      seoTitle: "Grand Hotel Palazzo Rome - Luxury 5-Star Hotel",
      seoDescription: "Stay at Grand Hotel Palazzo, Rome's finest luxury hotel near the Colosseum. Book your 5-star accommodation in the historic center.",
      featured: false
    },
    {
      id: 4,
      title: "Scuba Diving Adventure - Maldives",
      description: "Professional scuba diving experience in the crystal-clear waters of the Maldives with certified instructors.",
      type: "activity",
      status: "published",
      author: "Admin User",
      lastModified: "2025-01-05T11:20:00Z",
      thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
      content: `Dive into the underwater paradise of the Maldives with our professional scuba diving experiences. Suitable for all skill levels from beginners to advanced divers.\n\nDiving Packages:\n• Beginner Course - PADI Open Water certification\n• Advanced Diving - Deep water and night dives\n• Specialty Courses - Underwater photography, wreck diving\n• Daily Dive Trips - Morning and afternoon sessions\n\nWhat You'll See:\n• Colorful coral reefs\n• Tropical fish species\n• Manta rays and whale sharks\n• Underwater caves and formations\n\nAll equipment provided, certified PADI instructors, small group sizes for personalized attention.`,
      tags: ["maldives", "scuba", "diving", "underwater", "adventure"],
      seoTitle: "Maldives Scuba Diving - PADI Certified Courses",
      seoDescription: "Experience world-class scuba diving in the Maldives. PADI certified courses and daily dive trips for all skill levels.",
      featured: true
    },
    {
      id: 5,
      title: "Early Bird Summer Sale - 30% Off",
      description: "Limited time promotion offering 30% discount on all summer vacation packages. Book now and save big!",
      type: "promotion",
      status: "pending",
      author: "Content Manager",
      lastModified: "2025-01-14T13:10:00Z",
      thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
      content: `Don't miss our biggest sale of the year! Get 30% off all summer vacation packages when you book before March 31st.\n\nSale Highlights:\n• 30% discount on all packages\n• Free cancellation up to 48 hours\n• Flexible date changes\n• Bonus amenities included\n• Payment plans available\n\nDestinations Included:\n• Mediterranean cruises\n• Caribbean getaways\n• European city breaks\n• Asian adventures\n• African safaris\n\nTerms and Conditions:\n• Valid for bookings made before March 31, 2025\n• Travel dates: June 1 - September 30, 2025\n• Cannot be combined with other offers\n• Subject to availability`,
      tags: ["sale", "discount", "summer", "promotion", "vacation"],
      seoTitle: "Summer Sale 30% Off - Early Bird Vacation Deals",
      seoDescription: "Save 30% on summer vacation packages. Limited time early bird sale with free cancellation and flexible booking options.",
      featured: true
    },
    {
      id: 6,
      title: "Tokyo Cultural Experience",
      description: "Immerse yourself in Japanese culture with traditional tea ceremonies, temple visits, and authentic cuisine.",
      type: "destination",
      status: "archived",
      author: "Editor",
      lastModified: "2024-12-20T08:30:00Z",
      thumbnail: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop",
      content: `Discover the rich cultural heritage of Tokyo through authentic experiences that showcase Japan's traditions and modern innovations.\n\nCultural Highlights:\n• Traditional tea ceremony workshops\n• Temple and shrine visits\n• Authentic kaiseki dining\n• Calligraphy and origami classes\n• Sumo wrestling demonstrations\n• Cherry blossom viewing (seasonal)\n\nNeighborhoods to Explore:\n• Asakusa - Traditional Tokyo\n• Shibuya - Modern urban culture\n• Harajuku - Youth and fashion\n• Ginza - Upscale shopping and dining\n\nBest experienced with a local guide who can provide cultural context and language assistance.`,
      tags: ["tokyo", "japan", "culture", "traditional", "temples"],
      seoTitle: "Tokyo Cultural Experience - Traditional Japan Tours",
      seoDescription: "Experience authentic Japanese culture in Tokyo. Tea ceremonies, temple visits, and traditional activities with local guides.",
      featured: false
    }
  ]);

  const contentStats = {
    total: contentData?.length,
    published: contentData?.filter(item => item?.status === 'published')?.length,
    draft: contentData?.filter(item => item?.status === 'draft')?.length
  };

  // Filter content based on current filters
  const filteredContent = contentData?.filter(item => {
    const matchesType = filters?.contentType === 'all' || item?.type === filters?.contentType;
    const matchesStatus = filters?.status === 'all' || item?.status === filters?.status;
    const matchesAuthor = filters?.author === 'all' || item?.author?.toLowerCase()?.includes(filters?.author?.toLowerCase());
    const matchesSearch = !filters?.search || 
      item?.title?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
      item?.description?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
      item?.tags?.some(tag => tag?.toLowerCase()?.includes(filters?.search?.toLowerCase()));
    const matchesDate = !filters?.dateFrom || 
      new Date(item.lastModified) >= new Date(filters.dateFrom);

    return matchesType && matchesStatus && matchesAuthor && matchesSearch && matchesDate;
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      contentType: 'all',
      status: 'all',
      author: 'all',
      dateFrom: '',
      search: ''
    });
  };

  const handleSelectItem = (id, checked) => {
    setSelectedItems(prev => 
      checked 
        ? [...prev, id]
        : prev?.filter(item => item !== id)
    );
  };

  const handleSelectAll = (checked) => {
    setSelectedItems(checked ? filteredContent?.map(item => item?.id) : []);
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
  };

  const handleBulkAction = (action) => {
    console.log(`Applying ${action} to items:`, selectedItems);
    
    if (action === 'delete') {
      setContentData(prev => prev?.filter(item => !selectedItems?.includes(item?.id)));
    } else if (action === 'publish') {
      setContentData(prev => prev?.map(item => 
        selectedItems?.includes(item?.id) 
          ? { ...item, status: 'published', lastModified: new Date()?.toISOString() }
          : item
      ));
    } else if (action === 'unpublish') {
      setContentData(prev => prev?.map(item => 
        selectedItems?.includes(item?.id) 
          ? { ...item, status: 'draft', lastModified: new Date()?.toISOString() }
          : item
      ));
    } else if (action === 'archive') {
      setContentData(prev => prev?.map(item => 
        selectedItems?.includes(item?.id) 
          ? { ...item, status: 'archived', lastModified: new Date()?.toISOString() }
          : item
      ));
    }
    
    setSelectedItems([]);
  };

  const handleCreateNew = () => {
    setCurrentContent(null);
    setEditorOpen(true);
  };

  const handleEdit = (content) => {
    setCurrentContent(content);
    setEditorOpen(true);
  };

  const handlePreview = (content) => {
    setCurrentContent(content);
    setPreviewOpen(true);
  };

  const handleDelete = (content) => {
    if (window.confirm(`Are you sure you want to delete "${content?.title}"?`)) {
      setContentData(prev => prev?.filter(item => item?.id !== content?.id));
    }
  };

  const handleSaveContent = (contentData) => {
    if (currentContent) {
      // Update existing content
      setContentData(prev => prev?.map(item => 
        item?.id === currentContent?.id ? contentData : item
      ));
    } else {
      // Add new content
      setContentData(prev => [...prev, contentData]);
    }
    setEditorOpen(false);
    setCurrentContent(null);
  };

  const handleBulkImport = () => {
    console.log('Opening bulk import dialog');
  };

  const handleExport = () => {
    console.log('Exporting selected content:', selectedItems);
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <div className="p-6">
          <AdminBreadcrumb />
          
          <ContentHeader
            onCreateNew={handleCreateNew}
            onBulkImport={handleBulkImport}
            onExport={handleExport}
            selectedCount={selectedItems?.length}
          />

          <ContentFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            contentStats={contentStats}
          />

          <ContentTable
            content={filteredContent}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPreview={handlePreview}
            onStatusChange={handleBulkAction}
          />

          <BulkActionsBar
            selectedCount={selectedItems?.length}
            onBulkAction={handleBulkAction}
            onClearSelection={handleClearSelection}
            isVisible={selectedItems?.length > 0}
          />

          <ContentEditor
            isOpen={editorOpen}
            onClose={() => {
              setEditorOpen(false);
              setCurrentContent(null);
            }}
            content={currentContent}
            onSave={handleSaveContent}
          />

          <ContentPreview
            isOpen={previewOpen}
            onClose={() => {
              setPreviewOpen(false);
              setCurrentContent(null);
            }}
            content={currentContent}
          />
        </div>
      </main>
    </div>
  );
};

export default ContentManagement;
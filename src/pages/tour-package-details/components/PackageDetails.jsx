import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PackageDetails = ({ packageData }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedDay, setExpandedDay] = useState(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Info' },
    { id: 'itinerary', label: 'Itinerary', icon: 'MapPin' },
    { id: 'inclusions', label: 'What\'s Included', icon: 'Check' },
    { id: 'terms', label: 'Terms & Conditions', icon: 'FileText' }
  ];

  const toggleDay = (dayIndex) => {
    setExpandedDay(expandedDay === dayIndex ? null : dayIndex);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading font-semibold text-lg text-foreground mb-3">
          About This Package
        </h3>
        <p className="font-body text-muted-foreground leading-relaxed">
          {packageData?.description}
        </p>
      </div>

      <div>
        <h4 className="font-heading font-semibold text-foreground mb-3">Highlights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {packageData?.highlights?.map((highlight, index) => (
            <div key={index} className="flex items-start space-x-3">
              <Icon name="Check" size={16} className="text-success mt-1 flex-shrink-0" />
              <span className="font-body text-muted-foreground">{highlight}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-heading font-semibold text-foreground mb-3">What Makes This Special</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {packageData?.specialFeatures?.map((feature, index) => (
            <div key={index} className="bg-muted/50 rounded-lg p-4 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name={feature?.icon} size={24} className="text-primary" />
              </div>
              <h5 className="font-body font-semibold text-foreground mb-2">{feature?.title}</h5>
              <p className="font-body text-sm text-muted-foreground">{feature?.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderItinerary = () => (
    <div className="space-y-4">
      <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
        Day-by-Day Itinerary
      </h3>
      
      {packageData?.itinerary?.map((day, index) => (
        <div key={index} className="border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleDay(index)}
            className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-tourism"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                {index + 1}
              </div>
              <div className="text-left">
                <h4 className="font-body font-semibold text-foreground">{day?.title}</h4>
                <p className="font-body text-sm text-muted-foreground">{day?.location}</p>
              </div>
            </div>
            <Icon 
              name="ChevronDown" 
              size={20} 
              className={`transition-transform ${expandedDay === index ? 'rotate-180' : ''}`}
            />
          </button>
          
          {expandedDay === index && (
            <div className="p-4 border-t border-border">
              <p className="font-body text-muted-foreground mb-4">{day?.description}</p>
              
              <div className="space-y-3">
                <div>
                  <h5 className="font-body font-semibold text-foreground mb-2">Activities</h5>
                  <ul className="space-y-1">
                    {day?.activities?.map((activity, actIndex) => (
                      <li key={actIndex} className="flex items-start space-x-2">
                        <Icon name="Clock" size={14} className="text-primary mt-1 flex-shrink-0" />
                        <span className="font-body text-sm text-muted-foreground">{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Icon name="Utensils" size={14} className="text-accent" />
                    <span className="text-muted-foreground">Meals: {day?.meals}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Bed" size={14} className="text-secondary" />
                    <span className="text-muted-foreground">Stay: {day?.accommodation}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderInclusions = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
          What's Included
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {packageData?.inclusions?.map((item, index) => (
            <div key={index} className="flex items-start space-x-3">
              <Icon name="Check" size={16} className="text-success mt-1 flex-shrink-0" />
              <span className="font-body text-muted-foreground">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
          What's Not Included
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {packageData?.exclusions?.map((item, index) => (
            <div key={index} className="flex items-start space-x-3">
              <Icon name="X" size={16} className="text-error mt-1 flex-shrink-0" />
              <span className="font-body text-muted-foreground">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTerms = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
          Booking Terms & Conditions
        </h3>
        <div className="space-y-4">
          {packageData?.terms?.map((section, index) => (
            <div key={index}>
              <h4 className="font-body font-semibold text-foreground mb-2">{section?.title}</h4>
              <p className="font-body text-muted-foreground leading-relaxed">{section?.content}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="AlertTriangle" size={20} className="text-warning mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-body font-semibold text-warning mb-2">Important Notice</h4>
            <p className="font-body text-sm text-muted-foreground">
              Please read all terms and conditions carefully before booking. 
              Cancellation policies may vary based on the package and booking date.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'itinerary':
        return renderItinerary();
      case 'inclusions':
        return renderInclusions();
      case 'terms':
        return renderTerms();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-tourism">
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex space-x-0 overflow-x-auto">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-6 py-4 font-body font-medium transition-tourism whitespace-nowrap ${
                activeTab === tab?.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </nav>
      </div>
      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default PackageDetails;
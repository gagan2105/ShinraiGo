import { useState } from "react";
import { User, Shield, Phone, MapPin, Bell, Briefcase, FileText, Settings, Heart, AlertTriangle, UserPlus, CheckCircle } from "lucide-react";

export default function UserPortal() {
    const [activeTab, setActiveTab] = useState("profile");
    const [autoFiling, setAutoFiling] = useState(false);
    const [locationShared, setLocationShared] = useState(true);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Tourist Web Portal</h2>
                <p className="text-slate-500 text-sm mt-1">Manage your profile, emergency contacts, and security preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Fixed User Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 flex flex-col items-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-brand-400 to-indigo-500"></div>
                        <div className="w-24 h-24 rounded-full bg-white p-1 relative z-10 mt-8 shadow-md">
                            <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-full h-full rounded-full object-cover" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mt-4">John Doe</h3>
                        <p className="text-sm text-slate-500">Tourist ID: AADHAAR-XXXX</p>

                        <div className="mt-4 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full flex items-center">
                            <Shield className="w-4 h-4 text-emerald-500 mr-2" />
                            <span className="text-xs font-semibold text-emerald-700">Premium Protection Active</span>
                        </div>

                        <div className="w-full mt-6 pt-6 border-t border-slate-100 space-y-3">
                            <div className="flex items-center text-sm text-slate-600 font-medium">
                                <Heart className="w-4 h-4 mr-3 text-rose-400" />
                                Blood Group: O+
                            </div>
                            <div className="flex items-center text-sm text-slate-600 font-medium">
                                <Phone className="w-4 h-4 mr-3 text-brand-400" />
                                +91 98765 43210
                            </div>
                            <div className="flex items-center text-sm text-slate-600 font-medium">
                                <MapPin className="w-4 h-4 mr-3 text-amber-500" />
                                Darjeeling, West Bengal
                            </div>
                        </div>
                    </div>

                    {/* Quick Navigation Menu */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-2">
                        {[
                            { id: 'profile', label: 'Personal & Contacts', icon: User },
                            { id: 'journey', label: 'Active Journey', icon: Briefcase },
                            { id: 'security', label: 'Security & Preferences', icon: Settings }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === tab.id
                                        ? 'bg-slate-900 text-white'
                                        : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <tab.icon className={`w-5 h-5 mr-3 ${activeTab === tab.id ? 'text-brand-400' : 'text-slate-400'}`} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3">
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center">
                                        <UserPlus className="w-5 h-5 mr-2 text-brand-500" />
                                        Emergency Contacts
                                    </h3>
                                    <button className="text-sm text-brand-600 font-medium hover:text-brand-700 bg-brand-50 px-3 py-1.5 rounded-lg transition-colors">
                                        + Add Contact
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { name: 'Alice Doe', relation: 'Spouse', phone: '+91 98765 11111' },
                                        { name: 'Robert Smith', relation: 'Brother', phone: '+91 98765 22222' }
                                    ].map((contact, i) => (
                                        <div key={i} className="flex items-center p-4 border border-slate-100 rounded-xl hover:shadow-sm transition-shadow">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                                                <User className="w-5 h-5 text-slate-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{contact.name}</p>
                                                <p className="text-xs text-slate-500">{contact.relation} • {contact.phone}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-4">Medical & ID Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verified Identity</label>
                                        <p className="mt-1 text-sm font-medium text-slate-800 p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center">
                                            <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" />
                                            Aadhaar / Passport Verified
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Allergies / Conditions</label>
                                        <p className="mt-1 text-sm font-medium text-slate-800 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            None Reported
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'journey' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Current Itinerary: Darjeeling Trip</h3>
                            <div className="relative border-l-2 border-slate-100 ml-3 pl-6 space-y-8">
                                <div className="relative">
                                    <div className="absolute -left-[31px] bg-emerald-500 w-4 h-4 rounded-full border-4 border-emerald-100"></div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800">Arrival at Bagdogra Airport</h4>
                                        <p className="text-xs text-slate-500 mt-1">10:00 AM • Checked In</p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[31px] bg-brand-500 w-4 h-4 rounded-full border-4 border-brand-100"></div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800">Hotel Check-in: The Elgin</h4>
                                        <p className="text-xs text-slate-500 mt-1">2:00 PM • Safe Zone verification completed.</p>
                                    </div>
                                </div>
                                <div className="relative opacity-50">
                                    <div className="absolute -left-[31px] bg-slate-300 w-4 h-4 rounded-full border-4 border-white"></div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800">Tiger Hill Sunrise</h4>
                                        <p className="text-xs text-slate-500 mt-1">Tomorrow, 4:00 AM • Scheduled</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-4">Tracking & Visibility</h3>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-800">Live Location Sharing</h4>
                                            <p className="text-xs text-slate-500 mt-1">Share location with emergency contacts and authorities.</p>
                                        </div>
                                        <button
                                            onClick={() => setLocationShared(!locationShared)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${locationShared ? 'bg-brand-500' : 'bg-slate-300'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${locationShared ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-800">Auto E-FIR Generation</h4>
                                            <p className="text-xs text-slate-500 mt-1">Automatically file a report if emergency SOS holds for 5+ mins.</p>
                                        </div>
                                        <button
                                            onClick={() => setAutoFiling(!autoFiling)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoFiling ? 'bg-rose-500' : 'bg-slate-300'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoFiling ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-amber-50 rounded-2xl shadow-sm border border-amber-200/60 p-6 flex flex-col items-center text-center">
                                <div className="bg-rose-100 p-3 rounded-full mb-3">
                                    <AlertTriangle className="w-8 h-8 text-rose-600" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Trigger Mock SOS</h3>
                                <p className="text-sm text-slate-600 mt-2 max-w-md">Simulate an emergency alert trigger to your emergency contacts and local authorities for drill testing.</p>
                                <button className="mt-4 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-rose-500/30 w-full sm:w-auto">
                                    Initiate Test SOS
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

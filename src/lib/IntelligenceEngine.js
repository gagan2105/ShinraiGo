import { toast } from "sonner";

// 1. Context-Aware Risk Engine
export const calculateRiskContext = (inDangerZone, inactivityMinutes = 0) => {
    const hour = new Date().getHours();
    const isLateNight = hour >= 22 || hour <= 4;
    
    let score = 0;
    if (inDangerZone) score += 50;
    if (isLateNight) score += 30;
    if (inactivityMinutes > 30) score += 20;

    let level, color, text, confidence;

    if (score >= 70) {
        level = 'High Risk';
        color = 'bg-rose-500';
        text = 'text-rose-600';
        confidence = 94; // AI Confidence metric
    } else if (score >= 30) {
        level = 'Medium Risk';
        color = 'bg-amber-500';
        text = 'text-amber-600';
        confidence = 88;
    } else {
        level = 'Safe';
        color = 'bg-emerald-500';
        text = 'text-emerald-600';
        confidence = 98;
    }

    return { level, color, text, confidence, score };
};

// 4. Crowd Density Estimation (Simulated AI Model)
export const estimateCrowdDensity = (score) => {
    // Inverse correlation for demo: sparse areas during risk is worse
    if (score >= 70) return { label: 'Sparse', value: '12 users/km²', type: 'high-risk' };
    if (score >= 30) return { label: 'Moderate', value: '45 users/km²', type: 'medium' };
    return { label: 'Dense', value: '180 users/km²', type: 'safe' };
};

// 5. Intelligent Alert Classification
export const classifyAlertNetwork = (eventData) => {
    // Parse raw text logically
    if (eventData.toLowerCase().includes('panic') || eventData.toLowerCase().includes('sos')) {
        return { tag: 'Panic Alert', severity: 'Critical', action: 'Dispatch Auth' };
    }
    if (eventData.toLowerCase().includes('zone')) {
        return { tag: 'Danger Zone Entry', severity: 'Warning', action: 'Notify User' };
    }
    if (eventData.toLowerCase().includes('inactive')) {
        return { tag: 'Prolonged Inactivity', severity: 'Alert', action: 'Check-in Ping' };
    }
    return { tag: 'General Alert', severity: 'Info', action: 'Log' };
};

// 7. Multi-Channel Alert Simulation
export const triggerMultiChannelAlert = (type, user) => {
    // In-app Notification
    toast.error(`CRITICAL: ${type} triggered for ${user}`, { style: { background: '#ef4444', color: 'white' } });
    
    // Simulating SMS/Email Dispatch
    setTimeout(() => {
        toast.message(`[SMS DISPATCHED] Emergency contacts for ${user} notified.`);
    }, 1500);

    setTimeout(() => {
        toast.message(`[POLICE API] Local station alerted with GPS coordinates.`);
    }, 3000);
};
// 8. Predictive AI Risk Modeling (Simulation)
export const predictFutureRisk = () => {
    const currentHour = new Date().getHours();
    const forecast = [];
    
    for (let i = 0; i < 6; i++) {
        const hour = (currentHour + i * 4) % 24;
        let risk = 'Safe';
        let val = 20;
        
        if (hour >= 22 || hour <= 4) {
            risk = 'High';
            val = 85;
        } else if (hour >= 18 || hour <= 6) {
            risk = 'Medium';
            val = 55;
        }
        
        forecast.push({
            time: `${hour}:00`,
            level: risk,
            value: val + Math.floor(Math.random() * 10)
        });
    }
    return forecast;
};

import React from 'react';
import { TrendingUp, TrendingDown } from "lucide-react";

export default function TrendingIcon({ isTrendUp }) {
    return isTrendUp ? <TrendingUp className="h-5 w-5 text-green-500" /> : <TrendingDown className="h-5 w-5 text-red-500" />;
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';

export default function DZRZVD_Configurator() {
  const [config, setConfig] = useState({
    shellMaterial: 'BRE-TEX 2.5L',
    color: '#1e3a8a',
    fillWeight: 80,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const calculateCBS = () => {
    const totalMaterials = 32.8;
    const laborCost = 5.9;
    const manufacturingOverhead = 3.9;
    const profit8 = (totalMaterials + laborCost + manufacturingOverhead) * 0.08;
    const grandTotal = (totalMaterials + laborCost + manufacturingOverhead + profit8).toFixed(2);

    return { totalMaterials: totalMaterials.toFixed(2), laborCost: laborCost.toFixed(2), manufacturingOverhead: manufacturingOverhead.toFixed(2), profit8: profit8.toFixed(2), grandTotal };
  };

  const cbs = calculateCBS();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = config.color;
    ctx.fillRect(45, 65, 310, 290);
    ctx.fillStyle = '#e0d4ff';
    ctx.fillRect(70, 95, 260, 230);
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(200, 85);
    ctx.lineTo(200, 335);
    ctx.stroke();
  }, [config.color]);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("DZRZVD 超薄羽绒服 配置", 20, 30);
    doc.text(`GRAND TOTAL: $${cbs.grandTotal} USD`, 20, 60);
    doc.save("DZRZVD_配置.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4">DZRZVD</h1>
          <p className="text-2xl text-gray-600">户外运动用品 B2B AI 配置平台</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 bg-white p-8 rounded-3xl shadow">
            <h2 className="text-2xl font-semibold mb-6">DIY 配置</h2>
            <div className="flex gap-4 mb-8">
              {['#1e3a8a', '#111827', '#b91c1c'].map(c => (
                <button
                  key={c}
                  onClick={() => setConfig({...config, color: c})}
                  className="w-16 h-16 rounded-2xl border-4 border-white shadow"
                  style={{backgroundColor: c}}
                />
              ))}
            </div>
            <button onClick={exportPDF} className="w-full bg-black text-white py-4 rounded-2xl">
              下载 SPEC SHEET PDF
            </button>
          </div>

          <div className="lg:col-span-4 bg-white p-8 rounded-3xl shadow">
            <h2 className="text-2xl font-semibold mb-6">实时产品预览</h2>
            <canvas ref={canvasRef} width={380} height={420} className="mx-auto border rounded-3xl" />
          </div>

          <div className="lg:col-span-4 bg-white p-8 rounded-3xl shadow">
            <h2 className="text-2xl font-semibold mb-6">CBS 成本单 (USD)</h2>
            <div className="text-5xl font-bold text-black mb-4">${cbs.grandTotal}</div>
            <p className="text-sm text-gray-500">GRAND TOTAL (含8%利润)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
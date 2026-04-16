'use client';

import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';

export default function Home() {
  const [config, setConfig] = useState({
    shellMaterial: 'BRE-TEX 2.5L',
    color: '#1e3a8a',
    fillWeight: 80,
    zipperType: 'YKK #3 轻量',
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const shellMaterials = {
    'BRE-TEX 2.5L': { price: 8.5, loss: 10 },
    '高太尔轻量面料': { price: 7.2, loss: 9 },
    '冰感防晒尼龙': { price: 4.5, loss: 8 },
  };

  const calculateCBS = () => {
    const shell = shellMaterials[config.shellMaterial as keyof typeof shellMaterials];
    const shellCost = 1.85 * shell.price * (1 + shell.loss / 100);
    const fillCost = config.fillWeight * 0.1;
    const zipperCost = 1.8;

    const totalMaterials = (shellCost + fillCost + zipperCost).toFixed(2);
    const laborCost = (parseFloat(totalMaterials) * 0.18).toFixed(2);
    const manufacturingOverhead = (parseFloat(totalMaterials) * 0.12).toFixed(2);
    const profit8 = (parseFloat(totalMaterials) * 0.08 * 1.38).toFixed(2); // 简化计算
    const grandTotal = (parseFloat(totalMaterials) + parseFloat(laborCost) + parseFloat(manufacturingOverhead) + parseFloat(profit8)).toFixed(2);

    return { totalMaterials, laborCost, manufacturingOverhead, profit8, grandTotal };
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
    doc.text(`GRAND TOTAL: $${cbs.grandTotal}`, 20, 60);
    doc.save("配置.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-5xl font-bold mb-6">DZRZVD 超薄羽绒服</h1>
        <p className="text-xl text-gray-600 mb-8">B2B AI 配置器 - 已部署版</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 bg-white p-8 rounded-3xl shadow">
          <h2 className="text-2xl font-semibold mb-6">DIY 配置</h2>
          <button onClick={exportPDF} className="w-full bg-black text-white py-4 rounded-2xl">
            下载 PDF
          </button>
        </div>

        <div className="lg:col-span-4 bg-white p-8 rounded-3xl shadow">
          <h2 className="text-2xl font-semibold mb-6">产品预览</h2>
          <canvas ref={canvasRef} width={380} height={420} className="mx-auto border rounded-2xl" />
        </div>

        <div className="lg:col-span-4 bg-white p-8 rounded-3xl shadow">
          <h2 className="text-2xl font-semibold mb-6">CBS 成本单</h2>
          <div className="text-4xl font-bold text-black">${cbs.grandTotal}</div>
          <p className="text-sm text-gray-500">GRAND TOTAL (含8%利润)</p>
        </div>
      </div>
    </div>
  );
}
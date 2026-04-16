'use client';

import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';

export default function DZRZVD_Configurator() {
  const [config, setConfig] = useState({
    shellMaterial: 'BRE-TEX 2.5L',
    color: '#1e3a8a',
    fillWeight: 80,
    zipperType: 'YKK #3 轻量',
    labDipping: '已确认',
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const shellMaterials = {
    'BRE-TEX 2.5L': { price: 8.5, loss: 10, lead: 25, property: '防水≥15000mm' },
    '高太尔轻量面料': { price: 7.2, loss: 9, lead: 20, property: '四向弹力' },
    '冰感防晒尼龙': { price: 4.5, loss: 8, lead: 15, property: 'UPF50+ 凉感' },
  };

  const zipperOptions = {
    'YKK #3 轻量': { price: 1.2, lead: 10 },
    'YKK #5 防水': { price: 2.1, lead: 15 },
    '反光拉链': { price: 2.8, lead: 18 },
  };

  const fills = {
    60: { name: '极致轻薄', pricePerGram: 0.085 },
    80: { name: '标准轻暖', pricePerGram: 0.094 },
    120: { name: '加强保暖', pricePerGram: 0.11 },
  };

  const calculateCBS = () => {
    const shell = shellMaterials[config.shellMaterial as keyof typeof shellMaterials];
    const zipper = zipperOptions[config.zipperType as keyof typeof zipperOptions];
    const fill = fills[config.fillWeight as keyof typeof fills];

    const shellCost = 1.85 * shell.price * (1 + shell.loss / 100);
    const fillCost = config.fillWeight * fill.pricePerGram * 1.12;
    const zipperCost = zipper.price;

    const totalMaterials = Number((shellCost + fillCost + zipperCost).toFixed(2));

    const laborCost = Number((totalMaterials * 0.18).toFixed(2));
    const manufacturingOverhead = Number((totalMaterials * 0.12).toFixed(2));
    const sgaFinance = Number((totalMaterials * 0.08).toFixed(2));

    const subtotal = totalMaterials + laborCost + manufacturingOverhead + sgaFinance;
    const profit8 = Number((subtotal * 0.08).toFixed(2));
    const grandTotal = (subtotal + profit8).toFixed(2);

    const maxLead = Math.max(shell.lead, zipper.lead, 15);
    const estimatedDate = new Date(Date.now() + (maxLead + 18) * 86400000).toLocaleDateString('zh-CN');

    return { totalMaterials, laborCost, manufacturingOverhead, profit8, grandTotal, estimatedDate };
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
    doc.setFontSize(18);
    doc.text("DZRZVD 超薄羽绒服 - 自定义配置", 20, 25);
    doc.setFontSize(13);
    doc.text(`面料: ${config.shellMaterial}`, 20, 45);
    doc.text(`填充: ${config.fillWeight}g/m²`, 20, 60);
    doc.text(`GRAND TOTAL: $${cbs.grandTotal} USD`, 20, 80);
    doc.text(`预计完成日期: ${cbs.estimatedDate}`, 20, 95);
    doc.save("DZRZVD_超薄羽绒服_配置.pdf");
  };

  return (
    <div className="min-h-screen bg-zinc-100 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold tracking-tight mb-4">DZRZVD</h1>
          <p className="text-2xl text-zinc-600">户外运动用品 B2B AI 配置平台</p>
          <div className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full shadow-sm mt-6 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            实时成本计算 • 8%利润 • LAB-DIPPING同步
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* DIY 配置 */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-semibold mb-8">深度自定义</h2>

              <div className="space-y-8">
                <div>
                  <label className="text-sm font-medium block mb-3">外壳面料</label>
                  <select 
                    value={config.shellMaterial}
                    onChange={(e) => setConfig({...config, shellMaterial: e.target.value})}
                    className="w-full p-4 border border-zinc-300 rounded-2xl text-base focus:outline-none focus:border-black"
                  >
                    {Object.keys(shellMaterials).map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-3">颜色</label>
                  <div className="flex gap-5">
                    {['#1e3a8a', '#111827', '#b91c1c'].map(c => (
                      <button
                        key={c}
                        onClick={() => setConfig({...config, color: c})}
                        className={`w-16 h-16 rounded-2xl border-4 transition-all ${config.color === c ? 'border-black scale-110' : 'border-white shadow'}`}
                        style={{backgroundColor: c}}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-3">填充克重 ({config.fillWeight} g/m²)</label>
                  <input 
                    type="range" 
                    min="60" 
                    max="120" 
                    step="20"
                    value={config.fillWeight}
                    onChange={(e) => setConfig({...config, fillWeight: Number(e.target.value)})}
                    className="w-full accent-black"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-3">拉链类型</label>
                  <select 
                    value={config.zipperType}
                    onChange={(e) => setConfig({...config, zipperType: e.target.value})}
                    className="w-full p-4 border border-zinc-300 rounded-2xl text-base focus:outline-none focus:border-black"
                  >
                    {Object.keys(zipperOptions).map(z => (
                      <option key={z} value={z}>{z}</option>
                    ))}
                  </select>
                </div>

                <button 
                  onClick={exportPDF}
                  className="w-full bg-black text-white py-4 rounded-2xl font-medium hover:bg-zinc-800 transition text-lg"
                >
                  下载 SPEC SHEET PDF
                </button>
              </div>
            </div>
          </div>

          {/* 预览 */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl shadow-xl p-8 h-full flex flex-col">
              <h2 className="text-2xl font-semibold mb-8">实时产品效果</h2>
              <div className="flex-1 flex items-center justify-center">
                <canvas 
                  ref={canvasRef} 
                  width={380} 
                  height={450} 
                  className="border border-zinc-200 rounded-3xl shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* CBS */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-8">
              <h2 className="text-2xl font-semibold mb-8">CBS 成本构成</h2>
              
              <div className="space-y-6 text-[17px]">
                <div className="flex justify-between pb-4 border-b">
                  <span className="text-zinc-600">TOTAL MATERIALS</span>
                  <span className="font-semibold">${cbs.totalMaterials}</span>
                </div>
                <div className="flex justify-between pb-4 border-b">
                  <span className="text-zinc-600">LABOR COST</span>
                  <span className="font-semibold">${cbs.laborCost}</span>
                </div>
                <div className="flex justify-between pb-4 border-b">
                  <span className="text-zinc-600">MANUFACTURING & OVERHEAD</span>
                  <span className="font-semibold">${cbs.manufacturingOverhead}</span>
                </div>
                <div className="flex justify-between pt-6 text-xl font-bold">
                  <span>PROFIT (8%)</span>
                  <span>${cbs.profit8}</span>
                </div>
              </div>

              <div className="mt-12 pt-10 border-t-2 border-black text-center">
                <div className="text-6xl font-bold tracking-tighter text-black mb-2">
                  ${cbs.grandTotal}
                </div>
                <p className="uppercase tracking-widest text-sm text-zinc-500">GRAND TOTAL</p>
                <p className="text-sm text-zinc-500 mt-6">
                  预计完成日期：{cbs.estimatedDate}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
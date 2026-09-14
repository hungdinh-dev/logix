'use client'

import React, { useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Printer, Download, Award, ShieldCheck, QrCode } from 'lucide-react'
import type { UserCertificateItem } from '../types/certificate-admin.types'

interface CertificatePreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  certificate?: UserCertificateItem | null
}

export function CertificatePreviewModal({
  open,
  onOpenChange,
  certificate,
}: CertificatePreviewModalProps) {
  const printRef = useRef<HTMLDivElement>(null)

  if (!certificate) return null

  const handlePrint = () => {
    window.print()
  }

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '—'
    const d = new Date(dateStr)
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const signatoryName =
    certificate.template?.signatoryName || 'Ban Giám Đốc Khảo Thí'
  const signatoryTitle =
    certificate.template?.signatoryTitle || 'Giám đốc Đào tạo & Quản lý Chất lượng'
  const organization =
    certificate.issuingOrganization ||
    certificate.template?.issuingOrganization ||
    'Trung tâm Đào tạo & Khảo thí Ba Hưng'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto rounded-2xl p-4 sm:p-6 bg-slate-900/90 dark:bg-slate-950/90 text-foreground border-slate-700">
        <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-400" />
            <DialogTitle className="text-base font-bold text-white">
              Bản Xem Trước Chứng Chỉ In Ấn (A4 Landscape)
            </DialogTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="h-8 px-3 text-xs gap-1.5 bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-lg cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>In Ngay (Print)</span>
            </Button>
          </div>
        </DialogHeader>

        {/* 📜 CERTIFICATE A4 CANVAS CONTAINER */}
        <div className="w-full overflow-x-auto py-4 flex justify-center">
          <div
            ref={printRef}
            id="printable-certificate"
            className="w-[840px] h-[594px] bg-[#FCFBF7] text-slate-900 relative p-8 select-none shadow-2xl rounded-sm border-[12px] border-[#1E293B] overflow-hidden flex flex-col justify-between"
            style={{
              fontFamily: "'Times New Roman', Times, serif, system-ui",
            }}
          >
            {/* Ornate Gold Inner Border */}
            <div className="absolute inset-2 border-2 border-[#D4AF37] pointer-events-none" />
            <div className="absolute inset-3 border border-[#D4AF37]/50 pointer-events-none" />

            {/* Corner Ornaments */}
            <div className="absolute top-4 left-4 text-[#D4AF37] text-lg font-serif">✦</div>
            <div className="absolute top-4 right-4 text-[#D4AF37] text-lg font-serif">✦</div>
            <div className="absolute bottom-4 left-4 text-[#D4AF37] text-lg font-serif">✦</div>
            <div className="absolute bottom-4 right-4 text-[#D4AF37] text-lg font-serif">✦</div>

            {/* Background Watermark Crest */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <Award className="w-96 h-96 text-slate-900" />
            </div>

            {/* 1. Header Section */}
            <div className="text-center relative z-10 pt-2">
              <div className="inline-flex items-center gap-2 mb-1">
                <div className="h-7 w-7 rounded-full bg-[#1E293B] text-[#D4AF37] flex items-center justify-center font-bold text-xs">
                  BH
                </div>
                <span className="text-xs uppercase tracking-[0.25em] font-bold text-slate-700">
                  {organization}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold uppercase tracking-wider text-[#1E293B] mt-2 font-serif">
                Giấy Chứng Nhận
              </h1>
              <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold mt-0.5">
                Certificate of Completion &amp; Competency
              </p>
            </div>

            {/* 2. Body Section */}
            <div className="text-center relative z-10 my-auto space-y-3">
              <p className="text-xs italic text-slate-600">
                Chứng nhận thành tích học tập và tiêu chuẩn nghiệp vụ được trao cho:
              </p>

              {/* Recipient Full Name */}
              <div className="text-3xl font-bold text-[#1E293B] tracking-wide border-b-2 border-[#D4AF37] pb-1.5 max-w-md mx-auto font-serif">
                {certificate.recipientName || certificate.user?.fullName}
              </div>

              <div className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed pt-1">
                Đã hoàn thành xuất sắc toàn bộ chương trình đào tạo và vượt qua kỳ kiểm tra đánh giá:
              </div>

              {/* Course Title Badge */}
              <div className="text-lg font-bold text-slate-900 bg-amber-50/80 border border-amber-200/80 py-1 px-4 rounded-md max-w-lg mx-auto shadow-2xs font-sans">
                {certificate.title}
              </div>

              {certificate.finalScore && (
                <div className="text-xs font-semibold text-emerald-800">
                  Kết quả đánh giá: <strong>{certificate.finalScore}%</strong> (Đạt chuẩn năng lực)
                </div>
              )}
            </div>

            {/* 3. Footer Section with Seal, QR & Signatures */}
            <div className="grid grid-cols-3 items-end pt-4 relative z-10 border-t border-slate-200 text-slate-800">
              {/* Left: Certificate Meta & QR Code */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-14 w-14 bg-white p-1 border border-slate-300 rounded shadow-2xs flex items-center justify-center">
                    <QrCode className="h-12 w-12 text-slate-800" />
                  </div>
                  <div className="text-[10px] space-y-0.5 text-slate-600 font-sans">
                    <p className="font-mono font-bold text-slate-900">
                      {certificate.certificateCode}
                    </p>
                    <p>Ngày cấp: {formatDate(certificate.issueDate)}</p>
                    <p>
                      Hạn dùng:{' '}
                      {certificate.expiryDate
                        ? formatDate(certificate.expiryDate)
                        : 'Vô thời hạn'}
                    </p>
                    <p className="text-[9px] text-[#D4AF37] font-semibold">
                      Quét QR để xác thực
                    </p>
                  </div>
                </div>
              </div>

              {/* Center: Gold Foil Official Seal */}
              <div className="text-center flex flex-col items-center justify-center">
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#F5D77F] via-[#D4AF37] to-[#AA820A] flex items-center justify-center shadow-md border-2 border-white">
                  <div className="w-13 h-13 rounded-full border border-dashed border-[#1E293B]/40 flex flex-col items-center justify-center text-center p-1">
                    <ShieldCheck className="h-4 w-4 text-[#1E293B]" />
                    <span className="text-[7px] font-bold text-[#1E293B] uppercase tracking-tighter leading-tight mt-0.5">
                      Ba Hưng
                      <br />
                      VERIFIED
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider mt-1">
                  Mộc Bảo Chứng
                </span>
              </div>

              {/* Right: Signature & Stamp */}
              <div className="text-center space-y-1">
                <p className="text-[11px] text-slate-600">Đại diện Ban Khảo Thí &amp; QA</p>
                <div className="h-10 flex items-center justify-center relative">
                  {/* Signature Simulation Stamp */}
                  <span className="font-serif italic text-lg text-indigo-900 font-bold tracking-widest opacity-85 select-none rotate-[-4deg]">
                    {signatoryName}
                  </span>
                  {/* Red stamp watermark */}
                  <div className="absolute w-12 h-12 rounded-full border-2 border-rose-600/60 text-rose-600/70 text-[7px] font-bold flex items-center justify-center rotate-[15deg] pointer-events-none uppercase">
                    Đã duyệt
                  </div>
                </div>
                <p className="text-xs font-bold text-[#1E293B]">{signatoryName}</p>
                <p className="text-[10px] text-slate-500">{signatoryTitle}</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-slate-700/60 pt-3 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Khổ in khuyến nghị: <strong>A4 Ngang (Landscape)</strong>, Tỷ lệ Scale: 100%.
          </p>
          <Button
            size="sm"
            onClick={handlePrint}
            className="h-9 px-4 text-xs font-semibold gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 cursor-pointer shadow-xs"
          >
            <Printer className="h-4 w-4" />
            <span>In Chứng Chỉ (A4)</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

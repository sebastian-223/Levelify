import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, ExternalLink, Award } from 'lucide-react'
import { useCertStore } from '@/store/otherStores'
import { Button, Modal, Card, ProgressBar, StatCard, EmptyState } from '@/components/ui/index'
import { toast } from 'sonner'

const EMPTY = { name: '', provider: '', progress: 0, link: '', deadline: '', notes: '' }

export default function CertificationsPage() {
  const { certs, addCert, updateCert, deleteCert } = useCertStore()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY)

  const handleAdd = () => {
    if (!form.name.trim()) { toast.error('Certification name required'); return }
    addCert({ ...form, progress: Number(form.progress) })
    setForm(EMPTY)
    setShowModal(false)
    toast.success('Certification added! 🏆')
  }

  const completed = certs.filter(c => c.progress === 100).length

  return (
    <div className="page-wrapper">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">Certifications 🏆</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{certs.length} tracked · {completed} completed</p>
        </div>
        <Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4" /> Add Certification</Button>
      </div>

      {certs.length === 0 ? (
        <EmptyState icon="🏆" title="No certifications yet" description="Track your certification progress and never miss a deadline."
          action={<Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4" /> Add First Cert</Button>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certs.map((cert, i) => (
            <motion.div key={cert.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card hover className="p-5 group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                    <Award className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {cert.link && <a href={cert.link} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-gray-400 hover:text-primary-500 transition-colors"><ExternalLink className="w-3.5 h-3.5" /></a>}
                    <button onClick={() => { deleteCert(cert.id); toast.success('Removed') }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-0.5">{cert.name}</h3>
                <p className="text-xs text-gray-400 mb-3">{cert.provider}</p>
                <div className="flex items-center gap-2 mb-2">
                  <ProgressBar value={cert.progress} max={100} size="sm" color={cert.progress === 100 ? 'green' : 'primary'} className="flex-1" />
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{cert.progress}%</span>
                </div>
                <input type="range" min={0} max={100} value={cert.progress}
                  onChange={e => updateCert(cert.id, { progress: Number(e.target.value) })}
                  className="w-full accent-primary-500 cursor-pointer" />
                {cert.deadline && <p className="text-xs text-gray-400 mt-2">📅 Deadline: {cert.deadline}</p>}
                {cert.progress === 100 && <p className="text-xs text-green-500 font-semibold mt-1">✅ Completed!</p>}
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Certification">
        <div className="space-y-4">
          <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Name *</label>
            <input placeholder="e.g. AWS Solutions Architect" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary-500/30 transition-all" /></div>
          <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Provider</label>
            <input placeholder="e.g. Amazon, Google, Microsoft" value={form.provider} onChange={e => setForm(p => ({ ...p, provider: e.target.value }))} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary-500/30 transition-all" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Progress (%)</label>
              <input type="number" min={0} max={100} value={form.progress} onChange={e => setForm(p => ({ ...p, progress: e.target.value }))} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary-500/30 transition-all" /></div>
            <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Deadline</label>
              <input type="date" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary-500/30 transition-all" /></div>
          </div>
          <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Certificate Link</label>
            <input placeholder="https://..." value={form.link} onChange={e => setForm(p => ({ ...p, link: e.target.value }))} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary-500/30 transition-all" /></div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleAdd} className="flex-1">Add Certification 🏆</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

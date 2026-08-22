import re

with open('tradelines.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Update the buttons
old_btn = '<a href="https://kbrownconsultantgroupllc.getcredithelpnow.com/billing" class="block w-full text-center bg-slate-900 hover:bg-primary text-white py-4 rounded-xl font-bold transition-colors duration-300">\n                    Choose This Tradeline\n                </a>'
new_btn = '<button class="open-tradelines-modal block w-full text-center bg-slate-900 hover:bg-primary text-white py-4 rounded-xl font-bold transition-colors duration-300">\n                    Choose This Tradeline\n                </button>'
content = content.replace(old_btn, new_btn)

# If it was already changed to href='#'
old_btn_2 = '<a href="#" class="block w-full text-center bg-slate-900 hover:bg-primary text-white py-4 rounded-xl font-bold transition-colors duration-300">\n                    Choose This Tradeline\n                </a>'
content = content.replace(old_btn_2, new_btn)

# Add the modal and JS before </body>
modal_html = """
    <!-- Tradelines Modal -->
    <div id="tradelines-modal" class="fixed inset-0 z-[100] hidden items-center justify-center bg-slate-900/60 backdrop-blur-sm opacity-0 transition-opacity duration-300">
        <div class="bg-white w-full max-w-3xl mx-4 rounded-2xl shadow-2xl relative transform scale-95 transition-transform duration-300 overflow-hidden flex flex-col max-h-[90vh]">
            <div class="flex justify-between items-center p-6 border-b border-slate-100">
                <h3 class="text-2xl font-bold text-slate-900">Choose Your Tradeline</h3>
                <button id="close-modal-btn" class="text-slate-400 hover:text-secondary focus:outline-none transition-colors">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div class="p-0 overflow-y-auto flex-1 bg-slate-50 relative" style="min-height: 432px;">
                <iframe
                    src="https://api.kbrownconsultant.com/widget/form/6u5ymHnjsWJYSyabGXHR"
                    style="width:100%;height:100%;border:none;border-radius:5px; position:absolute; top:0; left:0; right:0; bottom:0;"
                    id="inline-6u5ymHnjsWJYSyabGXHR" 
                    data-layout="{'id':'INLINE'}"
                    data-trigger-type="alwaysShow"
                    data-trigger-value=""
                    data-activation-type="alwaysActivated"
                    data-activation-value=""
                    data-deactivation-type="neverDeactivate"
                    data-deactivation-value=""
                    data-form-name="Tradelines Form"
                    data-height="432"
                    data-layout-iframe-id="inline-6u5ymHnjsWJYSyabGXHR"
                    data-form-id="6u5ymHnjsWJYSyabGXHR"
                    title="Tradelines Form"
                        >
                </iframe>
                <script src="https://api.kbrownconsultant.com/js/form_embed.js"></script>
            </div>
        </div>
    </div>
    
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const modal = document.getElementById('tradelines-modal');
            const closeBtn = document.getElementById('close-modal-btn');
            const openBtns = document.querySelectorAll('.open-tradelines-modal');
            
            if (!modal) return;
            
            const modalInner = modal.querySelector('.bg-white');

            function openModal(e) {
                if (e) e.preventDefault();
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                
                setTimeout(() => {
                    modal.classList.remove('opacity-0');
                    modal.classList.add('opacity-100');
                    if(modalInner) {
                        modalInner.classList.remove('scale-95');
                        modalInner.classList.add('scale-100');
                    }
                }, 10);
                
                document.body.style.overflow = 'hidden';
            }

            function closeModal() {
                modal.classList.remove('opacity-100');
                modal.classList.add('opacity-0');
                if(modalInner) {
                    modalInner.classList.remove('scale-100');
                    modalInner.classList.add('scale-95');
                }
                
                setTimeout(() => {
                    modal.classList.remove('flex');
                    modal.classList.add('hidden');
                }, 300);
                
                document.body.style.overflow = '';
            }

            openBtns.forEach(btn => {
                btn.addEventListener('click', openModal);
            });

            if (closeBtn) closeBtn.addEventListener('click', closeModal);

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
            
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                    closeModal();
                }
            });
        });
    </script>
"""

if 'id="tradelines-modal"' not in content:
    content = content.replace('</body>', modal_html + '\n</body>')

with open('tradelines.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated tradelines.html with modal')

import { CheckSquare, Square } from "lucide-react";
import Layout from '../Layout';
import { useEffect, useState } from 'react';
import { UseAuth } from '../context/UseAuth';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
export default function NewCollective() {
    const { user, authloading, createCollective } = UseAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        guidelines: '',
        auto_approve: true,
    });
    useEffect(function () {
        if (!authloading && !user) {
            toast.error("Please login to create a collective.");
            navigate('/');
        }
    }, [user, authloading, navigate]);
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error("Collective name is required.");
            return;
        }
        if (!formData.description.trim()) {
            toast.error("Description is required.");
            return;
        }
        if (!formData.guidelines.trim()) {
            toast.error("Guidelines are required.");
            return;
        }
        const createToast = toast.loading("Creating collective...");
        try {
            const collective = await createCollective({
                name: formData.name.trim(),
                description: formData.description.trim(),
                guidelines: formData.guidelines.trim(),
                auto_approve: formData.auto_approve,
            });
            toast.success("Collective created successfully!", { id: createToast });
            navigate(`/collective/${collective.id}`);
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to create collective.", { id: createToast });
        }
    }
    return (<Layout>
            <main className="flex flex-col items-center lg:items-start px-4 py-8 lg:px-8 lg:py-12 lg:max-w-4xl lg:mx-auto w-full">
                <div className="w-full mb-8">
                    <h1 className="text-3xl font-bold text-accent">Create a New Collective</h1>
                    <p className="text-sm font-light text-inputaccent mt-1">
                        Build a community around your events and audience.
                    </p>
                    <hr className="border-inputaccent/30 mt-4"/>
                </div>

                <form className="w-full space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="collectiveName" className="block text-sm font-medium text-gray-700 mb-1">
                            Collective Name <span className="text-red-500">*</span>
                        </label>
                        <input type="text" id="collectiveName" placeholder="e.g. Eastside Social Club" className="w-full bg-inputbg/30 border border-inputaccent rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent" value={formData.name} onChange={function (e) {
            return setFormData({ ...formData, name: e.target.value });
        }}/>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea id="description" rows={5} placeholder="Tell people what your collective is about, the kind of events you host, and who it welcomes…" className="w-full bg-inputbg/30 border border-inputaccent rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-y" value={formData.description} onChange={function (e) {
            return setFormData({ ...formData, description: e.target.value });
        }}/>
                    </div>

                    <div>
                        <label htmlFor="guidelines" className="block text-sm font-medium text-gray-700 mb-1">
                            Guidelines <span className="text-red-500">*</span>
                        </label>
                        <textarea id="guidelines" rows={5} placeholder="Set the expectations for members and organisers. For example: be respectful, share updates, keep events inclusive, support venue etiquette…" className="w-full bg-inputbg/30 border border-inputaccent rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-y" value={formData.guidelines} onChange={function (e) {
            return setFormData({ ...formData, guidelines: e.target.value });
        }}/>
                    </div>

                    <div>
                        <button type="button" onClick={function () {
            return setFormData({ ...formData, auto_approve: !formData.auto_approve });
        }} className="flex items-center gap-2 text-sm text-inputaccent hover:text-accent transition-colors">
                            {!formData.auto_approve ? (<CheckSquare size={18} className="text-accent"/>) : (<Square size={18}/>)}
                            Auto-approve new members
                        </button>
                        <p className="text-xs text-inputaccent mt-1">
                            When enabled, members join immediately. When disabled, new requests wait for approval.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4 border-t border-inputaccent/20">
                        <button type="submit" className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent-dark transition-colors font-medium">
                            Create Collective
                        </button>
                        <button type="button" className="border border-inputaccent text-inputaccent px-6 py-2 rounded-lg hover:border-accent hover:text-accent transition-colors" onClick={function () {
            return navigate('/collectives');
        }}>
                            Cancel
                        </button>
                    </div>
                </form>
            </main>
        </Layout>);
}

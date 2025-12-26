import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Plus, Edit, Trash2, Eye, FileText } from "lucide-react";

async function getPages() {
    try {
        return await prisma.page.findMany({
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        return [];
    }
}

export default async function PagesManagementPage() {
    const pages = await getPages();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Static Pages</h1>
                    <p className="text-gray-400 mt-1">{pages.length} pages</p>
                </div>
                <Link
                    href="/manager/pages/new"
                    className="btn-gradient flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    New Page
                </Link>
            </div>

            {/* Pages Table */}
            <div className="glass rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-sm text-gray-400 border-b border-white/10">
                            <th className="px-6 py-4 font-medium">Title</th>
                            <th className="px-6 py-4 font-medium">Slug</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Last Updated</th>
                            <th className="px-6 py-4 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pages.map((page) => (
                            <tr
                                key={page.id}
                                className="border-b border-white/5 hover:bg-white/5"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-blue-500/20">
                                            <FileText className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <span className="font-medium">{page.title}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-400 font-mono text-sm">
                                    /{page.slug}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-medium ${page.isPublished
                                                ? "bg-green-500/20 text-green-400"
                                                : "bg-yellow-500/20 text-yellow-400"
                                            }`}
                                    >
                                        {page.isPublished ? "Published" : "Draft"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-400 text-sm">
                                    {formatDate(page.updatedAt)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {page.isPublished && (
                                            <Link
                                                href={`/pages/${page.slug}`}
                                                target="_blank"
                                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                        )}
                                        <Link
                                            href={`/manager/pages/${page.id}`}
                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {pages.length === 0 && (
                    <div className="text-center py-12">
                        <FileText className="w-12 h-12 mx-auto text-gray-600 mb-4" />
                        <p className="text-gray-400 mb-4">No pages yet</p>
                        <Link href="/manager/pages/new" className="btn-gradient">
                            Create Your First Page
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

"use client";

import { useSession } from "next-auth/react";

const ViewProfileSidebar = () => {
    const { data: session } = useSession();

    // Profil resmi yoksa kullanılacak varsayılan resim
    const defaultImage = "assets/images/user-grid/user-grid-img14.png";

    return (
        <div className="user-grid-card relative border border-slate-200 dark:border-slate-600 rounded-2xl overflow-hidden bg-white dark:bg-[#273142] h-full">
            <img src="assets/images/user-grid/user-grid-bg1.png" alt="" className="w-full object-fit-cover" />
            <div className="pb-6 ms-6 mb-6 me-6 -mt-[100px]">
                <div className="text-center border-b border-slate-200 dark:border-slate-600">
                    {/* Profil Resmi: Varsa session'dan, yoksa varsayılan */}
                    <img 
                        src={session?.user?.image || defaultImage} 
                        alt="Profile" 
                        className="border br-white border-width-2-px w-200-px h-[200px] rounded-full object-fit-cover mx-auto" 
                    />
                    {/* Kullanıcı Adı */}
                    <h6 className="mb-0 mt-4">
                        {session?.user?.name || "Kullanıcı"}
                    </h6>
                    {/* E-posta */}
                    <span className="text-neutral-500 dark:text-neutral-300 mb-4 block">
                        {session?.user?.email || "E-posta yok"}
                    </span>
                </div>
                
                <div className="mt-6">
                    <h6 className="text-xl mb-4">Personal Info</h6>
                    <ul>
                        <li className="flex items-center gap-1 mb-3">
                            <span className="w-[30%] text-base font-semibold text-neutral-600 dark:text-neutral-200">Full Name</span>
                            <span className="w-[70%] text-neutral-500 dark:text-neutral-300 font-medium">
                                : {session?.user?.name || "-"}
                            </span>
                        </li>
                        <li className="flex items-center gap-1 mb-3">
                            <span className="w-[30%] text-base font-semibold text-neutral-600 dark:text-neutral-200"> Email</span>
                            <span className="w-[70%] text-neutral-500 dark:text-neutral-300 font-medium">
                                : {session?.user?.email || "-"}
                            </span>
                        </li>
                        
                        {/* NOT: Telefon, Departman vb. bilgiler standart Auth.js session'ında gelmez. 
                           Bunları veritabanından ayrıca çekmek gerekir. Şimdilik statik veya boş bırakıyoruz.
                        */}
                        <li className="flex items-center gap-1 mb-3">
                            <span className="w-[30%] text-base font-semibold text-neutral-600 dark:text-neutral-200"> Phone Number</span>
                            <span className="w-[70%] text-neutral-500 dark:text-neutral-300 font-medium">: (Belirtilmemiş)</span>
                        </li>
                        <li className="flex items-center gap-1 mb-3">
                            <span className="w-[30%] text-base font-semibold text-neutral-600 dark:text-neutral-200"> Department</span>
                            <span className="w-[70%] text-neutral-500 dark:text-neutral-300 font-medium">: (Belirtilmemiş)</span>
                        </li>
                        <li className="flex items-center gap-1 mb-3">
                            <span className="w-[30%] text-base font-semibold text-neutral-600 dark:text-neutral-200"> Designation</span>
                            <span className="w-[70%] text-neutral-500 dark:text-neutral-300 font-medium">: User</span>
                        </li>
                        <li className="flex items-center gap-1 mb-3">
                            <span className="w-[30%] text-base font-semibold text-neutral-600 dark:text-neutral-200"> Languages</span>
                            <span className="w-[70%] text-neutral-500 dark:text-neutral-300 font-medium">: English, Turkish</span>
                        </li>
                        <li className="flex items-center gap-1">
                            <span className="w-[30%] text-base font-semibold text-neutral-600 dark:text-neutral-200"> Bio</span>
                            <span className="w-[70%] text-neutral-500 dark:text-neutral-300 font-medium">: Hoş geldiniz!</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ViewProfileSidebar;
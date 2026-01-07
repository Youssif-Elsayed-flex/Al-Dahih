import Lottie from 'lottie-react';

const Loading = ({ size = 'md', message = 'جاري التحميل...' }) => {
    const sizes = {
        sm: 'w-16 h-16',
        md: 'w-24 h-24',
        lg: 'w-32 h-32',
    };

    // Simple loading animation data
    const loadingAnimation = {
        v: "5.5.7",
        fr: 60,
        ip: 0,
        op: 120,
        w: 200,
        h: 200,
        nm: "Loading",
        ddd: 0,
        assets: [],
        layers: [
            {
                ddd: 0,
                ind: 1,
                ty: 4,
                nm: "Circle",
                sr: 1,
                ks: {
                    o: { a: 0, k: 100 },
                    r: { a: 1, k: [{ t: 0, s: [0] }, { t: 120, s: [360] }] },
                    p: { a: 0, k: [100, 100, 0] },
                    a: { a: 0, k: [0, 0, 0] },
                    s: { a: 0, k: [100, 100, 100] }
                },
                ao: 0,
                shapes: [
                    {
                        ty: "gr",
                        it: [
                            {
                                ty: "el",
                                p: { a: 0, k: [0, 0] },
                                s: { a: 0, k: [80, 80] }
                            },
                            {
                                ty: "st",
                                c: { a: 0, k: [0.96, 0.45, 0.09, 1] },
                                o: { a: 0, k: 100 },
                                w: { a: 0, k: 8 },
                                lc: 2,
                                lj: 1,
                                d: [{ n: "d", nm: "dash", v: { a: 0, k: 50 } }]
                            },
                            {
                                ty: "tr",
                                p: { a: 0, k: [0, 0] },
                                a: { a: 0, k: [0, 0] },
                                s: { a: 0, k: [100, 100] },
                                r: { a: 0, k: 0 },
                                o: { a: 0, k: 100 }
                            }
                        ]
                    }
                ],
                ip: 0,
                op: 120,
                st: 0,
                bm: 0
            }
        ],
        markers: []
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4 p-8">
            <div className={sizes[size]}>
                <Lottie animationData={loadingAnimation} loop={true} />
            </div>
            {message && (
                <p className="text-dark-600 font-medium animate-pulse">{message}</p>
            )}
        </div>
    );
};

export default Loading;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/layout/Header';
import { BottomNav } from '../../components/layout/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Users, Send, MessageSquare } from 'lucide-react';
import type { User } from '../../types';

interface ParentInfo extends User {
    children?: string[];
    messagesCount?: number;
}

export function ParentManagement() {
    const navigate = useNavigate();
    const [parents, setParents] = useState<ParentInfo[]>([]);

    useEffect(() => {
        loadParents();
    }, []);

    function loadParents() {
        // Load from localStorage
        const usersStr = localStorage.getItem('users');
        if (usersStr) {
            const users = JSON.parse(usersStr);
            const parentUsers = users.filter((u: User) => u.role === 'PARENT');
            setParents(parentUsers);
        } else {
            // Fallback to mock data
            const mockParents: ParentInfo[] = [
                {
                    id: 'p1',
                    role: 'PARENT',
                    name: 'OUEDRAOGO Marie',
                    phone: '+22678901234',
                    children: ['s1', 's2'],
                    messagesCount: 12,
                },
                {
                    id: 'p2',
                    role: 'PARENT',
                    name: 'SAWADOGO Pierre',
                    phone: '+22678901235',
                    children: ['s3'],
                    messagesCount: 5,
                },
            ];
            setParents(mockParents);
        }
    }

    function getChildrenNames(childIds: string[] = []) {
        const childrenMap: Record<string, string> = {
            's1': 'Aminata (6A)',
            's2': 'Ibrahim (5B)',
            's3': 'Fatoumata (5B)',
            's4': 'Moussa (6A)',
            's5': 'Aïcha (CM2)',
        };
        return childIds.map(id => childrenMap[id] || `Enfant ${id}`).join(', ');
    }

    function handleSendGlobalMessage() {
        navigate('/admin/messages/compose?to=all_parents');
    }

    function handleSendToParent(parentId: string) {
        navigate(`/admin/messages/compose?to=${parentId}`);
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header title="Gestion Parents" subtitle={`${parents.length} parent(s)`} />

            <main className="max-w-screen-sm mx-auto p-4 space-y-4">
                {/* Global Actions */}
                <Card className="bg-primary-50 border-primary-200">
                    <CardContent className="p-4">
                        <Button
                            onClick={handleSendGlobalMessage}
                            className="w-full"
                            size="lg"
                        >
                            <Send className="h-5 w-5 mr-2" />
                            Envoyer message à tous les parents
                        </Button>
                    </CardContent>
                </Card>

                {/* Parents List */}
                <div className="space-y-3">
                    {parents.map((parent) => (
                        <Card key={parent.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between text-base">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-5 w-5 text-primary-600" />
                                        {parent.name}
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {/* Phone */}
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-600">📱</span>
                                    <span className="text-gray-900">{parent.phone}</span>
                                </div>

                                {/* Children */}
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-1">Enfants :</p>
                                    <div className="flex flex-wrap gap-2">
                                        {getChildrenNames(parent.children).split(', ').map((child, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                                            >
                                                {child}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Messages Stats */}
                                {parent.messagesCount !== undefined && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MessageSquare className="h-4 w-4" />
                                        <span>{parent.messagesCount} message(s) envoyé(s)</span>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        onClick={() => handleSendToParent(parent.id)}
                                        size="sm"
                                        className="flex-1"
                                    >
                                        <Send className="h-4 w-4 mr-1" />
                                        Envoyer message
                                    </Button>
                                    <Button
                                        onClick={() => navigate(`/admin/parents/${parent.id}`)}
                                        size="sm"
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        Voir détails
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {parents.length === 0 && (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600">Aucun parent enregistré</p>
                        </CardContent>
                    </Card>
                )}
            </main>

            <BottomNav role="ADMIN" />
        </div>
    );
}

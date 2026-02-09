"use client"

import * as React from "react"
import Image from "next/image"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { doc, collection } from "firebase/firestore"
import { PlusCircle, MoreHorizontal, X, UploadCloud } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { Billboard } from "@/lib/types"
import { useBillboards } from "@/context/billboard-context"
import { useFirestore, setDocumentNonBlocking, addDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase"

const billboardFormSchema = z.object({
    name: z.string().min(2, "Name is too short"),
    location: z.string().min(5, "Location is too short"),
    size: z.string().min(3, "Invalid size"),
    availability: z.coerce.number().int().min(0, "Availability cannot be negative."),
    images: z.array(z.string().url("Invalid URL format.")).min(1, "At least one image is required."),
  })

type BillboardFormValues = z.infer<typeof billboardFormSchema>

export function BillboardsTable() {
  const { billboards } = useBillboards()
  const firestore = useFirestore()
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)
  const [editingBillboard, setEditingBillboard] = React.useState<Billboard | null>(null)
  const [deletingBillboard, setDeletingBillboard] = React.useState<Billboard | null>(null)

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(billboardFormSchema),
    defaultValues: { images: [], availability: 1 }
  })
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "images"
  });

  const handleOpenSheet = (billboard: Billboard | null) => {
    setEditingBillboard(billboard)
    if (billboard) {
      form.reset({
        name: billboard.name,
        location: billboard.location,
        size: billboard.size,
        availability: billboard.availability,
        images: billboard.images,
      })
    } else {
      form.reset({
        name: "",
        location: "",
        size: "",
        availability: 1,
        images: [],
      })
    }
    setIsSheetOpen(true)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            append(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
    }
    // Reset file input to allow re-uploading the same file
    event.target.value = '';
  };
  
  const onSubmit = (values: BillboardFormValues) => {
    if (editingBillboard) {
      const billboardRef = doc(firestore, 'billboards', editingBillboard.id);
      setDocumentNonBlocking(billboardRef, values, { merge: true });
    } else {
      const billboardsCollection = collection(firestore, 'billboards');
      addDocumentNonBlocking(billboardsCollection, values);
    }
    setIsSheetOpen(false)
  }
  
  const handleDelete = () => {
    if (!deletingBillboard) return;
    const billboardRef = doc(firestore, 'billboards', deletingBillboard.id);
    deleteDocumentNonBlocking(billboardRef);
  }

  return (
    <>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Billboard Listings</CardTitle>
            <CardDescription>View, create, edit, and delete billboard locations.</CardDescription>
        </div>
        <Button onClick={() => handleOpenSheet(null)} className="transition-transform duration-300 hover:scale-105">
          <PlusCircle className="mr-2 h-4 w-4" /> Create Billboard
        </Button>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Location</TableHead>
                    <TableHead className="hidden sm:table-cell">Availability (pcs)</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {billboards && billboards.map((billboard) => (
                    <TableRow key={billboard.id}>
                    <TableCell className="font-medium">{billboard.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{billboard.location}</TableCell>
                    <TableCell className="hidden sm:table-cell">{billboard.availability}</TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleOpenSheet(billboard)}>
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setDeletingBillboard(billboard)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>

    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-2xl">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
                <SheetHeader>
                <SheetTitle>{editingBillboard ? 'Edit Billboard' : 'Create New Billboard'}</SheetTitle>
                <SheetDescription>
                    {editingBillboard 
                    ? `Make changes to the "${editingBillboard.name}" listing.`
                    : 'Fill out the form to add a new billboard to the catalog.'
                    }
                </SheetDescription>
                </SheetHeader>
                <div className="flex-grow py-6 pr-6 space-y-4 overflow-y-auto">
                <FormField control={form.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Name</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                <FormField control={form.control} name="location" render={({ field }) => ( <FormItem> <FormLabel>Location</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                <FormField control={form.control} name="size" render={({ field }) => ( <FormItem> <FormLabel>Size</FormLabel> <FormControl><Input placeholder="e.g., 14' x 48'" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                <FormField control={form.control} name="availability" render={({ field }) => ( <FormItem> <FormLabel>Availability (pcs)</FormLabel> <FormControl><Input type="number" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                
                <FormItem>
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="relative aspect-video rounded-md overflow-hidden group bg-muted">
                                    {field.value && <Image src={field.value} alt={`Billboard Image ${index + 1}`} fill className="object-cover"/>}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button variant="destructive" size="icon" type="button" onClick={() => remove(index)}>
                                            <X className="h-4 w-4" />
                                            <span className="sr-only">Remove Image</span>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <label className="relative aspect-video rounded-md border-2 border-dashed border-muted-foreground/50 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-accent/10 transition-colors">
                                <UploadCloud className="w-8 h-8 text-muted-foreground/80" />
                                <span className="mt-2 text-sm text-muted-foreground/80">Upload Images</span>
                                <Input type="file" accept="image/*" onChange={handleFileChange} className="sr-only" multiple />
                            </label>
                        </div>
                    </FormControl>
                    <FormDescription>Upload one or more images for the billboard. The first image will be the primary one.</FormDescription>
                    <FormMessage />
                </FormItem>

                </div>
                <SheetFooter className="pt-6">
                <SheetClose asChild>
                    <Button type="button" variant="ghost">Cancel</Button>
                </SheetClose>
                <Button type="submit" disabled={form.formState.isSubmitting} className="transition-transform duration-300 hover:scale-105">
                    {editingBillboard ? 'Save Changes' : 'Create Billboard'}
                </Button>
                </SheetFooter>
            </form>
        </Form>
        </SheetContent>
    </Sheet>

    <AlertDialog open={!!deletingBillboard} onOpenChange={(open) => !open && setDeletingBillboard(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the billboard
                <span className="font-semibold"> "{deletingBillboard?.name}"</span>.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                Delete
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  )
}

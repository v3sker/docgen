"use client";

import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { NewCaseSchema } from "@/lib/schemas";
import { yupResolver } from "@hookform/resolvers/yup";
import { generateDocument } from "@/lib/generateDocument";
import { useEffect, useRef, useState, useTransition } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCheck, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

export default function NewCaseForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const documentType = useRef('contract');

  const [isDefactoAddressAdded, setDefactoAddressAdded] = useState(false);

  const form = useForm({
    resolver: yupResolver(NewCaseSchema),
    defaultValues: {
      credit: {
        id: 0, amount: 0, issuedDate: `${format(new Date(), 'dd.MM.yyyy')}`,
      },
      addresses: {
        defacto: { region: '', city: '', street: '', number: '', buildingNumber: '', apartment: '' },
        residence: { region: '', city: '', street: '', number: '', buildingNumber: '', apartment: ''  }
      },
      contactData: {
        mainNumber: '',
        email: '',
      },
      identification: {
        bulletin: { idnp: 0, issuedBy: '', issuedAt: '', series: '', expiration: '' },
      },
      personalData: { birthDate: '', firstName: '', lastName: ''}
    }
  });

  const { toast } = useToast()

  // console.log(`form errors: `, form.formState.errors);
  const onSubmit = async (values) => {
    console.log('onSubmit values: ', values)
    console.log('onSubmit docType: ', documentType.current)

    setError(false);
    setSuccess(false);

    startTransition( async () => {
      await generateDocument(values, documentType.current)
        .then((data) => {
          setError(data.error);
          setSuccess(data.success);
        })
        .catch((error) => {
          setError(error);
        });
    });
  };

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: `Ошибка генерации документа!`,
        description: `${error}`,
      })
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      toast({
        title: `${documentType.current.toString().slice(0, 1).toUpperCase() + documentType.current.toString().slice(1)} сгенерирован!`,
        description: `В течении короткого времени начнётся его загрузка. Если загрузка не 
        начинается - обратитесь к администратору!`,
      })
    }
  }, [success]);

  return (
    <div className={'flex justify-center py-4'}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={'flex flex-col gap-4 w-[1300px]'}>
          <div className="pt-4 sm:pt-0 flex items-center gap-4 px-4 h-[40px]">
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              DocGen v1.0
            </h1>
            <div className="items-center gap-2 ml-auto flex sm:pt-0">

              <Select
                defaultValue={documentType.current}
                onValueChange={(value) => {documentType.current = value}}
              >
                <SelectTrigger className={'hover:bg-white hover:shadow transition'}>
                  <SelectValue placeholder="Выберите документ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="template">Your docs. variants here</SelectItem>
                </SelectContent>
              </Select>

              <Button type="submit" disabled={isPending} className={'bg-zinc-900 hover:bg-zinc-700'}>
                <div className={'flex items-center gap-2'}>
                  <CheckCheck className="h-5 w-5"/>
                  Сгенерировать
                </div>
              </Button>

            </div>
          </div>

          <main
            className="grid flex-1 items-start gap-4 p-4 sm:px-4 sm:py-0 md:gap-8 lg:grid-cols-2"
          >
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
              <div className="grid gap-2 md:grid-cols-1 lg:grid-cols-3 md:gap-4 2xl:gap-6">
                <div className="grid auto-rows-max items-start gap-2 lg:col-span-2 md:gap-4 2xl:gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className={'text-2xl'}>Данные о контракте</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        <div className={'flex gap-4 w-full'}>
                          <FormField
                            control={form.control}
                            name={`credit.id`}
                            render={({field}) => (
                              <FormItem className={'w-full'}>
                                <FormLabel>ID (из старой CRM)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder={"2400654"}
                                    className={'no-spinner'}
                                    disabled={isPending}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage/>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="credit.amount"
                            render={({field}) => (
                              <FormItem className={'w-full'}>
                                <FormLabel>Сумма кредита</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    disabled={isPending}
                                    placeholder={"10000"}
                                    className={'no-spinner'}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage/>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`credit.issuedDate`}
                            render={({field}) => (
                              <FormItem className={'w-full'}>
                                <FormLabel>Дата заявки</FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    disabled={isPending}
                                    placeholder={"01/09/2024"}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage/>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className={'text-2xl'}>Буллетин</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={'flex flex-col gap-4 w-full'}>
                        <div className={'flex gap-4'}>
                          <FormField
                            control={form.control}
                            name={`identification.bulletin.idnp`}
                            render={({field}) => (
                              <FormItem className={'w-full'}>
                                <FormLabel>IDNP</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    className={'no-spinner'}
                                    disabled={isPending}
                                    placeholder={"2004600718344"}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage/>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`identification.bulletin.series`}

                            render={({field}) => (
                              <FormItem className={'w-full'}>
                                <FormLabel>Серия</FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    disabled={isPending}
                                    placeholder={"B75839672"}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage/>
                              </FormItem>
                            )}
                          />

                        </div>
                        <div className={'flex gap-4'}>

                          <FormField
                            control={form.control}
                            name={`identification.bulletin.issuedAt`}
                            render={({field}) => (
                              <FormItem className={'w-full'}>
                                <FormLabel>Дата выдачи</FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    disabled={isPending}
                                    placeholder={"25.07.2023"}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage/>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`identification.bulletin.expiration`}
                            render={({field}) => (
                              <FormItem className={'w-full'}>
                                <FormLabel>Годен до</FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    disabled={isPending}
                                    placeholder={"25.07.2027"}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage/>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`identification.bulletin.issuedBy`}
                            render={({field}) => (
                              <FormItem className={'w-full'}>
                                <FormLabel>Выдан</FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    disabled={isPending}
                                    placeholder={"AGENTIA SERVICII PUBLICE"}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage/>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className={'text-2xl'}>Адресс проживания</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-8">
                        <div className="flex flex-col gap-2">
                          <h2 className={'text-xl font-medium'}>Прописка</h2>
                          <div className={'flex flex-col gap-4 w-full'}>
                            <div className={'flex gap-4'}>
                              <FormField
                                control={form.control}
                                name={`addresses.residence.region`}
                                render={({field}) => (
                                  <FormItem className={'w-full'}>
                                    <FormLabel>Район</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="text"
                                        disabled={isPending}
                                        placeholder={"r. Edinet"}
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage/>
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`addresses.residence.city`}
                                render={({field}) => (
                                  <FormItem className={'w-full'}>
                                    <FormLabel>Город</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="text"
                                        disabled={isPending}
                                        placeholder={"sat. Bratusheni"}
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage/>
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`addresses.residence.street`}
                                render={({field}) => (
                                  <FormItem className={'w-full'}>
                                    <FormLabel>Улица</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="text"
                                        disabled={isPending}
                                        placeholder={"str. Puskin"}
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage/>
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className={'flex gap-4'}>
                              <FormField
                                control={form.control}
                                name={`addresses.residence.number`}

                                render={({field}) => (
                                  <FormItem className={'w-full'}>
                                    <FormLabel>Номер</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="text"
                                        disabled={isPending}
                                        placeholder={"60/2"}
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage/>
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`addresses.residence.buildingNumber`}
                                render={({field}) => (
                                  <FormItem className={'w-full'}>
                                    <FormLabel>Поъезд</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="text"
                                        disabled={isPending}
                                        placeholder={"5"}
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage/>
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`addresses.residence.apartment`}
                                render={({field}) => (
                                  <FormItem className={'w-full'}>
                                    <FormLabel>Квартира</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="text"
                                        disabled={isPending}
                                        placeholder={"ap. 31"}
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage/>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </div>

                        {!isDefactoAddressAdded && (
                          <Button
                            className={`flex justify-center items-center h-[50px] w-full bg-slate-50 border-2 
                            border-slate-200 rounded-xl border-dashed cursor-pointer text-slate-400 hover:text-slate-500 
                            hover:border-slate-500 transition hover:bg-slate-50`}
                            type='button'
                            disabled={isPending}
                            onClick={() => setDefactoAddressAdded(true)}
                          >
                            Добавить адресс (фактический)
                          </Button>
                        )}

                        {isDefactoAddressAdded && (
                          <div className="flex flex-col gap-2">
                            <div className={'flex justify-between'}>
                              <h2 className={'text-xl font-medium'}>Фактический адресс</h2>
                              <Button
                                size={'sm'}
                                className={'px-2.5 py-1 bg-white text-black hover:bg-slate-50'}
                                onClick={() => setDefactoAddressAdded(false)}
                              >
                                <Trash className={'w-4 h-4'}/>
                              </Button>
                            </div>
                            <div className={'flex flex-col gap-4 w-full'}>
                              <div className={'flex gap-4'}>
                                <FormField
                                  control={form.control}
                                  name={`addresses.defacto.region`}
                                  render={({field}) => (
                                    <FormItem className={'w-full'}>
                                      <FormLabel>Район</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="text"
                                          disabled={isPending}
                                          placeholder={"mun. Chisinau"}
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage/>
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={`addresses.defacto.city`}
                                  render={({field}) => (
                                    <FormItem className={'w-full'}>
                                      <FormLabel>Город</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="text"
                                          disabled={isPending}
                                          placeholder={"Chisinau"}
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage/>
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={`addresses.defacto.street`}
                                  render={({field}) => (
                                    <FormItem className={'w-full'}>
                                      <FormLabel>Улица</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="text"
                                          disabled={isPending}
                                          placeholder={"str. Puskin"}
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage/>
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <div className={'flex gap-4'}>
                                <FormField
                                  control={form.control}
                                  name={`addresses.defacto.number`}

                                  render={({field}) => (
                                    <FormItem className={'w-full'}>
                                      <FormLabel>Номер</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="text"
                                          disabled={isPending}
                                          placeholder={"60/2"}
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage/>
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={`addresses.defacto.buildingNumber`}
                                  render={({field}) => (
                                    <FormItem className={'w-full'}>
                                      <FormLabel>Поъезд</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="text"
                                          disabled={isPending}
                                          placeholder={"5"}
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage/>
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={`addresses.defacto.apartment`}
                                  render={({field}) => (
                                    <FormItem className={'w-full'}>
                                      <FormLabel>Квартира</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="text"
                                          disabled={isPending}
                                          placeholder={"142"}
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage/>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid auto-rows-max items-start gap-2 md:gap-4 2xl:gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className={'text-2xl'}>Личные данные</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={'flex flex-col gap-4 w-full'}>
                        <FormField
                          control={form.control}
                          name={`personalData.firstName`}
                          render={({field}) => (
                            <FormItem className={'w-full'}>
                              <FormLabel>Имя</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder={"Mihai"}
                                  disabled={isPending}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage/>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="personalData.lastName"
                          render={({field}) => (
                            <FormItem className={'w-full'}>
                              <FormLabel>Фамилия</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  disabled={isPending}
                                  placeholder={"Ivan"}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage/>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`personalData.birthDate`}
                          render={({field}) => (
                            <FormItem className={'w-full'}>
                              <FormLabel>Дата рождния</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  disabled={isPending}
                                  placeholder={"27.08.1991"}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage/>
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className={'text-2xl'}>Контактные данные</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-4 w-full">
                        <FormField
                          control={form.control}
                          name={`contactData.email`}
                          render={({field}) => (
                            <FormItem className={'w-full'}>
                              <FormLabel>Эл. почта</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  disabled={isPending}
                                  placeholder={"example@mail.com"}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage/>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`contactData.mainNumber`}
                          render={({field}) => (
                            <FormItem className={'w-full'}>
                              <FormLabel>Контактный номер</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  disabled={isPending}
                                  placeholder={"069722722"}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage/>
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </form>
      </Form>
    </div>
  )
}
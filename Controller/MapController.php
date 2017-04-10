<?php

namespace MapBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use MapBundle\Entity\Location;
use MapBundle\Form\LocationType;

class MapController extends Controller
{
    public function indexAction(Request $request)
    {
        $entity = new Location();
        $form = $this->createCreateForm($entity);
        $form->handleRequest($request);
        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('map_homepage'));
        }
        return $this->render('MapBundle:Map:index.html.twig', [
            'form' => $form->createView()
        ]);
    }

    /**
     * Creates a form to create a Facts entity.
     *
     * @param Facts $entity The entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createCreateForm(Location $entity)
    {
        $form = $this->createForm(LocationType::class, $entity, array(
            'action' => $this->generateUrl('map_homepage'),
            'method' => 'POST'
        ));


        $form->add('submit', SubmitType::class, array('label' => 'Add location'));

        return $form;
    }

    public function addAction(Request $request)
    {
        $lat = $request->get('lat');
        $lng = $request->get('lng');
        $name = $request->get('name');
        $em = $this->getDoctrine()->getManager();
        //populate new location and inserting to db
        $marker = new Location();
        $marker->setName($name);
        $marker->setLat($lat);
        $marker->setLng($lng);

        $em->persist($marker);
        $em->flush();
        $response = new JsonResponse();

        return $response->setData(['status' => true, 'message' => 'worked']);
    }

    public function getAction()
    {
        $em = $this->getDoctrine()->getManager();
        $allLocations = $em->getRepository('MapBundle:Location')->getAll();
        $return = [];
        foreach ($allLocations as $location) {
            $return[] = [
                'lat'  => $location->getLat(),
                'lng'  => $location->getLng(),
                'name' => $location->getName()
            ];
        }
        $response = new JsonResponse();

        return $response->setData(['status' => true, 'data' => $return]);
    }

    public function deleteAllAction(){
        $em = $this->getDoctrine()->getManager();
        $em->getRepository('MapBundle:Location')->deleteAll();
        return $this->render('MapBundle:Map:deleteAll.html.twig', [
        ]);
    }
}
